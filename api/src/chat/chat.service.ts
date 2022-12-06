import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ChatRole,
  ChatRoom,
  ChatRoomVisibility,
  User,
  UserChatRoom,
  UserChatStatus,
} from '@prisma/client';
import * as argon2 from 'argon2';

import { PrismaService } from '../prisma/prisma.service';
import { ChatRoomWithMessages, CreateChatRoomDto } from './dto';
import { ChatMessageWithAuthor, CreateChatMessageDto } from './dto/message.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async createRoom(dto: CreateChatRoomDto, ownerId: number): Promise<ChatRoom> {
    const owner = await this.prisma.user.findUnique({
      where: {
        id: ownerId,
      },
    });

    if (!owner) {
      throw new BadRequestException("Room owner doesn't exist");
    }

    let hash = undefined;
    let isProtected = false;
    if (dto.password) {
      dto.password = dto.password.trim();
      if (dto.password.length > 0) {
        hash = await argon2.hash(dto.password);
        isProtected = true;
      }
    }

    delete dto.password;
    return this.prisma.chatRoom.create({
      data: {
        ...dto,
        hash,
        isProtected,
        users: {
          create: [
            {
              isOwner: true,
              role: ChatRole.ADMIN,
              user: { connect: { id: owner.id } },
            },
          ],
        },
      },
      include: {
        users: true,
      },
    });
  }

  async getRoomsForUser(userId: number): Promise<ChatRoom[]> {
    const rooms = await this.prisma.chatRoom.findMany({
      where: {
        OR: [
          { users: { some: { userId } } },
          { visibility: ChatRoomVisibility.PUBLIC },
        ],
      },
      include: {
        users: true,
      },
    });
    rooms.map((room) => {
      delete room.hash;
      return room;
    });
    return rooms;
  }

  async addUserToRoom(
    userId: number,
    roomId: string,
    password?: string,
  ): Promise<UserChatRoom> {
    const userChatRoom = await this.prisma.userChatRoom.findUnique({
      where: { userId_roomId: { roomId, userId } },
    });

    if (userChatRoom) {
      throw new BadRequestException('User already in chat room');
    }

    const room = await this.prisma.chatRoom.findUnique({
      where: {
        id: roomId,
      },
    });

    if (!room) {
      throw new BadRequestException("Room doesn't exist");
    }

    if (room.isDM) {
      throw new BadRequestException('Cannot add users to this room');
    }

    if (room.isProtected) {
      if (!password) {
        throw new UnauthorizedException('Wrong password');
      }

      const passwordOk = await argon2.verify(room.hash, password);
      if (!passwordOk) {
        throw new UnauthorizedException('Wrong password');
      }
    }

    return await this.prisma.userChatRoom.create({
      data: { userId, roomId },
      include: {
        user: true,
      },
    });
  }

  async addUserToRoom2(userId: number, roomId: string): Promise<UserChatRoom> {
    const userChatRoom = await this.prisma.userChatRoom.findUnique({
      where: { userId_roomId: { roomId, userId } },
    });

    if (userChatRoom) {
      throw new BadRequestException('User already in chat room');
    }

    const room = await this.prisma.chatRoom.findUnique({
      where: {
        id: roomId,
      },
    });

    if (!room) {
      throw new BadRequestException("Room doesn't exist");
    }

    if (room.isDM) {
      throw new BadRequestException('Cannot add users to this room');
    }

    return await this.prisma.userChatRoom.create({
      data: { userId, roomId },
      include: {
        user: true,
      },
    });
  }

  async validateUserForRoom(userId: number, roomId: string): Promise<ChatRoom> {
    let room = await this.prisma.chatRoom.findFirst({
      where: {
        AND: {
          id: roomId,
          users: {
            some: { userId },
          },
        },
      },
    });

    if (!room) {
      room = await this.prisma.chatRoom.findFirst({
        where: { id: roomId, visibility: ChatRoomVisibility.PUBLIC },
      });
      if (room) {
        await this.addUserToRoom(userId, roomId);
      }
    }

    if (!room) {
      throw new UnauthorizedException("You can't access this chatroom");
    }

    return room;
  }

  async createMessage(
    userId: number,
    roomId: string,
    message: CreateChatMessageDto,
  ): Promise<ChatMessageWithAuthor> {
    const room = await this.validateUserForRoom(userId, roomId);
    await this.updateTimers(roomId);

    const user = await this.prisma.userChatRoom.findUnique({
      where: { userId_roomId: { roomId, userId } },
    });

    if (user && (user.status === 'MUTED' || user.status === 'BANNED')) {
      throw new UnauthorizedException('You cannot post in this room');
    }

    return this.prisma.chatMessage.create({
      data: {
        ...message,
        author: { connect: { id: userId } },
        room: { connect: { id: room.id } },
      },
      include: { author: true },
    });
  }

  async updateTimers(roomId: string): Promise<void> {
    const room = await this.prisma.chatRoom.findUnique({
      where: {
        id: roomId,
      },
      include: {
        users: true,
      },
    });

    if (!room) {
      console.log('Null room');
      return;
    }

    const usersToUpdate: UserChatRoom[] = [];
    for (const user of room.users) {
      if (user.status !== 'NORMAL' && user.statusTimer < new Date(Date.now())) {
        user.status = 'NORMAL';
        delete user.createdAt;
        delete user.updatedAt;
        delete user.statusTimer;
        usersToUpdate.push(user);
      }
    }

    for (const user of usersToUpdate) {
      await this.prisma.userChatRoom.update({
        where: {
          userId_roomId: {
            roomId: user.roomId,
            userId: user.userId,
          },
        },
        data: user,
      });
    }
  }

  async getRoomWithMessages(
    userId: number,
    roomId: string,
  ): Promise<ChatRoomWithMessages> {
    await this.validateUserForRoom(userId, roomId);
    await this.updateTimers(roomId);

    const userChat = await this.prisma.userChatRoom.findUnique({
      where: { userId_roomId: { roomId, userId } },
    });

    if (userChat.status === 'BANNED') {
      throw new UnauthorizedException('You are banned');
    }

    const room = await this.prisma.chatRoom.findUnique({
      where: {
        id: roomId,
      },
      include: {
        messages: {
          include: { author: true },
          orderBy: {
            createdAt: 'asc',
          },
        },
        users: {
          include: {
            user: true,
          },
        },
      },
    });

    delete room?.hash;
    return room;
  }

  async removeUserFromRoom(userId: number, roomId: string): Promise<void> {
    const userRoom = await this.prisma.userChatRoom.findUnique({
      where: {
        userId_roomId: {
          roomId,
          userId,
        },
      },
    });

    if (!userRoom) {
      throw new BadRequestException('User not in room');
    }

    await this.prisma.userChatRoom.delete({
      where: {
        userId_roomId: {
          roomId,
          userId,
        },
      },
    });

    const room = await this.prisma.chatRoom.findUnique({
      where: {
        id: roomId,
      },
      include: { users: true },
    });

    if (room.users.length === 0 || room.isDM) {
      if (room.isDM) {
        await this.prisma.userChatRoom.delete({
          where: {
            userId_roomId: { roomId: room.id, userId: room.users[0].userId },
          },
        });
      }
      await this.prisma.chatRoom.delete({
        where: {
          id: roomId,
        },
      });
    } else {
      const newOwner = room.users.reduce((prev, user) => {
        if (!prev) {
          return user;
        }

        if (prev.role !== 'ADMIN' && user.role === 'ADMIN') {
          return user;
        }

        return prev;
      });

      newOwner.role = 'ADMIN';
      newOwner.isOwner = true;

      await this.prisma.userChatRoom.update({
        where: {
          userId_roomId: {
            userId: newOwner.userId,
            roomId: newOwner.roomId,
          },
        },
        data: newOwner,
      });
    }
  }

  async getUserChatRoom(userId: number, roomId: string): Promise<UserChatRoom> {
    return this.prisma.userChatRoom.findUnique({
      where: {
        userId_roomId: {
          roomId,
          userId,
        },
      },
    });
  }

  async banUserFromRoom(
    userId: number,
    roomId: string,
    time: Date,
    status: 'BANNED' | 'MUTED',
  ): Promise<void> {
    const user = await this.prisma.userChatRoom.findUnique({
      where: { userId_roomId: { userId, roomId } },
    });

    if (user.isOwner || user.role === 'ADMIN') {
      throw new BadRequestException('Cannot ban or mute admins');
    }

    if (new Date(Date.now()) >= time) {
      throw new BadRequestException('Time must be in future');
    }

    await this.prisma.userChatRoom.update({
      where: {
        userId_roomId: {
          userId,
          roomId,
        },
      },
      data: {
        status,
        statusTimer: time,
      },
    });
  }

  async changePassword(
    userId: number,
    roomId: string,
    password: string,
  ): Promise<ChatRoom> {
    const userChatRoom = await this.prisma.userChatRoom.findUnique({
      where: { userId_roomId: { roomId, userId } },
    });

    if (!userChatRoom || userChatRoom?.isOwner === false) {
      throw new UnauthorizedException('Unauthorized');
    }

    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
    });
    if (password === '') {
      chatRoom.isProtected = false;
    } else {
      chatRoom.hash = await argon2.hash(password);
      chatRoom.isProtected = true;
    }

    return await this.prisma.chatRoom.update({
      where: { id: roomId },
      data: chatRoom,
    });
  }

  async changeUserRole(
    actionUserId: number,
    userId: number,
    roomId: string,
    role: ChatRole,
  ): Promise<UserChatRoom> {
    const actionUser = await this.getUserChatRoom(actionUserId, roomId);

    if (!actionUser || !actionUser?.isOwner) {
      throw new UnauthorizedException('Unauthorized');
    }

    const user = await this.getUserChatRoom(userId, roomId);

    if (!user || user?.isOwner) {
      throw new BadRequestException('Cannot change role of the owner');
    }

    return await this.prisma.userChatRoom.update({
      where: { userId_roomId: { roomId, userId } },
      data: {
        role,
      },
      include: {
        user: true,
      },
    });
  }

  async getUserChatStatus(
    userId: number,
    roomId: string,
  ): Promise<UserChatStatus> {
    await this.updateTimers(roomId);
    const user = await this.prisma.userChatRoom.findUnique({
      where: { userId_roomId: { roomId, userId } },
    });

    return user.status;
  }

  async createDm(user1: number, user2: number): Promise<ChatRoom> {
    const user = await this.prisma.user.findUnique({ where: { id: user1 } });
    const other = await this.prisma.user.findUnique({ where: { id: user2 } });

    if (!user || !other) {
      throw new BadRequestException('User not found');
    }

    const friendship1 = await this.prisma.friendship.findUnique({
      where: {
        requesterId_adresseeId: { adresseeId: user1, requesterId: user2 },
      },
    });
    const friendship2 = await this.prisma.friendship.findUnique({
      where: {
        requesterId_adresseeId: { adresseeId: user2, requesterId: user1 },
      },
    });

    if (
      friendship1 &&
      (friendship1.adresseeBlocker || friendship1.requesterBlocker)
    ) {
      throw new BadRequestException('User is blocked');
    }
    if (
      friendship2 &&
      (friendship2.adresseeBlocker || friendship2.requesterBlocker)
    ) {
      throw new BadRequestException('User is blocked');
    }

    const rooms = await this.prisma.chatRoom.findMany({
      where: {
        isDM: true,
        users: { some: { userId: user1 } },
      },
      include: { users: true },
    });

    for (const room of rooms) {
      for (const user of room.users) {
        if (user.userId === user2) {
          return room;
        }
      }
    }

    return await this.prisma.chatRoom.create({
      data: {
        name: user.displayName + ' ' + other.displayName,
        isDM: true,
        visibility: 'PRIVATE',
        users: {
          create: [
            {
              isOwner: false,
              role: ChatRole.USER,
              user: { connect: { id: user1 } },
            },
            {
              isOwner: false,
              role: ChatRole.USER,
              user: { connect: { id: user2 } },
            },
          ],
        },
      },
      include: {
        users: true,
      },
    });
  }

  async getAllBlockedUsers(userId: number): Promise<User[]> {
    const blockedFriendship1 = await this.prisma.friendship.findMany({
      where: {
        OR: [
          {
            requesterId: userId,
            requesterBlocker: true,
          },
          {
            requesterId: userId,
            adresseeBlocker: true,
          },
        ],
      },
      include: { adressee: true },
    });

    const blockedFriendship2 = await this.prisma.friendship.findMany({
      where: {
        OR: [
          {
            adresseeId: userId,
            requesterBlocker: true,
          },

          {
            adresseeId: userId,
            adresseeBlocker: true,
          },
        ],
      },
      include: { requester: true },
    });

    console.log(blockedFriendship1);
    console.log(blockedFriendship2);

    const blocked1 = blockedFriendship1.map((v) => {
      return v.adressee;
    });

    const blocked2 = blockedFriendship2.map((v) => {
      return v.requester;
    });

    return blocked1.concat(blocked2);
  }
}
