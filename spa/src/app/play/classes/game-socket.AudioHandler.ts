
export class AudioHandler {
	private sound_volume: number = 100;
	private music_volume: number = 50;
  private s_col_pad?: HTMLAudioElement;
	private s_col_wall?: HTMLAudioElement;
	private s_score?: HTMLAudioElement;

	private m_game?: HTMLAudioElement;
	private m_victory?: HTMLAudioElement;
	private m_defeat?: HTMLAudioElement;

	constructor(m_volume: number, s_volume: number){
		this.music_volume = m_volume;
		this.sound_volume = s_volume;
	}

	reset() {
		this.stop(this.m_game);
		this.stop(this.m_victory);
		this.stop(this.m_defeat);
	}

	stop(audio?: HTMLAudioElement) {
		if (!audio) return;
		audio?.pause();
		audio.currentTime = 0;
	}

	playSound(audio?: HTMLAudioElement, reload?: boolean, loop?: boolean){
		if (!audio) return;
		audio.volume = this.sound_volume;
		if (reload)	audio.load();
		if (loop) audio.loop = loop;
		audio.play();
	}

	playMusic(audio?: HTMLAudioElement, reload?: boolean, loop?: boolean){
		if (!audio) return;
		audio.volume = this.music_volume;
		if (reload) audio.load();
		if (loop) audio.loop = loop;
		audio.play();
	}

	playColPad(reload?: boolean){
		this.playSound(this.s_col_pad, reload, false);
	}

	playColWall(reload?: boolean){
		this.playSound(this.s_col_wall, reload, false);
	}

	playScore(reload?: boolean){
		this.playSound(this.s_score, reload, false);
	}


	playGame(reload?: boolean, loop?: boolean){
		this.playMusic(this.m_game, reload, loop);
	}
	stopGame(){
		this.m_game?.pause();
	}

	playVictory(reload?: boolean, loop?: boolean){
		this.playMusic(this.m_victory, reload, loop);
	}
	stopVictory(){
		this.m_victory?.pause();
	}

	playDefeat(reload?: boolean, loop?: boolean){
		this.playMusic(this.m_defeat, reload, loop);
	}
	stopDefeat(){
		this.m_defeat?.pause();
	}


	setSoundColPad(path: string){
		this.s_col_pad = new Audio(path);
	}

	setSoundColWall(path: string){
		this.s_col_wall = new Audio(path);
	}

	setSoundScore(path: string){
		this.s_score = new Audio(path);
	}

	setMusicGame(path: string){
		this.m_game = new Audio(path);
	}

	setMusicVictory(path: string){
		this.m_victory = new Audio(path);
	}

	setMusicDefeat(path: string){
		this.m_defeat = new Audio(path);
	}
}
