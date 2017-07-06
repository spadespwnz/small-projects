const fs = require('fs-extra');
var music_dir = 'E:/Program Files (x86)/Steam/SteamApps/common/Sonic Adventure 2/resource/gd_PC/ADX';
var songs_dir = 'E:/Program Files (x86)/Steam/SteamApps/common/Sonic Adventure 2/resource/gd_PC/ADX/songs';
var backup_dir = 'E:/Program Files (x86)/Steam/SteamApps/common/Sonic Adventure 2/resource/gd_PC/ADX/backup';
//var client = require('socket.io-client')('http://192.168.0.25:3000/song');
var client = require('socket.io-client')('http://www.spades.tech/song');
//client.connect('192.168.0.25:3000/song');


const exec = require('child_process').exec;
//cd c:/gopath/src/first && dir

function findCurrentStageId(callback){
	exec("cd c:/gopath/src/first && first -stage",{},function(error,stdout,stderr){
		if (error){
			return callback('-10');

		}
		return callback(stdout);
		//console.log('stderr: '+stderr);

	});
}
//const child = exec.spawn('cmd',['/c', 'cd c:/gopath/src/first'], {detached: true, stdio: ['ignore','ignore','ignore']})
//child.unref();



client.on('connect', function(){
	console.log("Connected");
});
client.on('set_song', function(user, song,stage){
	setSong2(user,song,stage);
})

client.on('request_song',function(){

	findCurrentStageId(function(id){
		var curr_stage = stage_map[parseInt(id)]
		client.emit('current_song',curr_stage+": "+current_song[curr_stage]);
	});
})

/*fs.readdir(music_dir, function(err, files){
	files.forEach(function(file){
		if (file == 'backup') return;
		if (file == 'songs') return;
		if (file == 'song_src') return;
		fs.copy(music_dir+'/'+file, backup_dir+'/'+file, function(err){
			if (err) return console.error(err);
			console.log(file+": Good");
		})
	})
});
*/
/*fs.readdir(songs_dir, function(err, files){
	files.forEach(function(file){
		console.log(file);
	})
});*/
client.on('reset',function(){
	fs.readdir(backup_dir, function(err, files){
		files.forEach(function(file){
			
			fs.copy(backup_dir+'/'+file, music_dir+'/'+file, function(err){
				if (err) return console.error(err);
				console.log(file+": Good");
			})
		})
	});
})

var stage_map = {
	3: 'GF',
	5: 'PH',
	7: 'AM',
	9: 'PL',
	10: 'MH',
	13: 'CE',
	16: 'WC',
	17: 'MS',
	19: 'SHADOW1',
	22: 'CG',
	23: 'HB',
	24: 'EE',
	25: 'DC',
	28: 'PC',
	30: 'FR',
	32: 'METEOR_HERD',
	33: 'ROUGE',
	42: 'SHADOW2',
	60: 'ROBOT',
	63: 'BOO',
	64: 'SAND_GOLEM',
	70: 'R101'
}
var lockout_time = {
	AM: 0,
	ROBOT: 0,
	BOO: 0,
	SAND_GOLEM: 0,
	ROUGE: 0,
	SHADOW1: 0,
	SHADOW2: 0,
	CE: 0,
	CE_TRUCK: 0,
	CG: 0,
	DC: 0,
	EE: 0,
	FR: 0,
	GF: 0,
	HB: 0,
	R101: 0,
	MH: 0,
	MH_END: 0,
	METEOR_HERD: 0,
	MS: 0,
	PC: 0,
	PH: 0,
	PL: 0,
	WC: 0,
}
var game_music = {
	AM: 'A_MINE',
	ROBOT: 'BOSS_01',
	BOO: 'BOSS_02A',
	SAND_GOLEM: 'BOSS_02B',
	ROUGE: 'BOSS_03',
	SHADOW1: 'BOSS_04',
	SHADOW2: 'BOSS_05',
	CE: 'C_ESCAP1',
	CE_TRUCK: 'C_ESCAP2',
	CG: 'C_GADGET',
	DC: 'D_CHAMBR',
	EE: 'E_ENGINE',
	FR: 'F_RUSH',
	GF: 'G_FORES',
	HB: 'H_BASE',
	R101: 'KART',
	MH: 'M_HARB1',
	MH_END: 'M_HARB2',
	METEOR_HERD: 'M_HERD',
	MS: 'M_STREET',
	PC: 'P_CAVE',
	PH: 'P_HILL',
	PL: 'P_LANE',
	WC: 'W_CANYON',
}

var current_song = {
	AM: 'DEFAULT',
	ROBOT: 'DEFAULT',
	BOO: 'DEFAULT',
	SAND_GOLEM: 'DEFAULT',
	ROUGE: 'DEFAULT',
	SHADOW1: 'DEFAULT',
	SHADOW2: 'DEFAULT',
	CE: 'DEFAULT',
	CE_TRUCK: 'DEFAULT',
	CG: 'DEFAULT',
	DC: 'DEFAULT',
	EE: 'DEFAULT',
	FR: 'DEFAULT',
	GF: 'DEFAULT',
	HB: 'DEFAULT',
	R101: 'DEFAULT',
	MH: 'DEFAULT',
	MH_END: 'DEFAULT',
	METEOR_HERD: 'DEFAULT',
	MS: 'DEFAULT',
	PC: 'DEFAULT',
	PH: 'DEFAULT',
	PL: 'DEFAULT',
	WC: 'DEFAULT',
}

var songs = [];
var song_map = [];
var tag_list=  [];
searchDir(songs_dir, '/');
fs.readdir(songs_dir, function(err, files){
	songs = files;

});


function searchDir(dir, tail){
	fs.readdir(dir+tail, function(err, files){
		files.forEach(function(file){
			var file_stats = fs.lstatSync(dir+tail+'/'+file);
			if (file_stats.isDirectory()){
				searchDir(dir,tail+file+'/');
				
			}
			else{
				var tag_str = tail.substring(1);
				tag_str = tag_str.slice(0,-1);
				var tags = tag_str.split("/");
				tags.push('random');
				tags.forEach(function(tag){
					if (tag_list.indexOf(tag) < 0){
						tag_list.push(tag);
					}
				});
				var song_obj = {};
				song_obj.dir = tail;
				song_obj.title = file;
				song_obj.tags = tags;
				//console.log(song_obj);
				song_map.push(song_obj);
				console.log(tag_list);
			}
		});
		//songs = files;
	});
}

//return Math.floor(Math.random() * (max - min)) + min;
/*console.log(songs);
setSong('lol', 'random');
setSong('PC', 'ok');
setSong('', 'ok');*/
function song_recurse(song, stage){
	fs.copy(songs_dir+'/'+song, music_dir+'/'+game_music[stage]+".adx", function(err){
		if (err) {
			setTimeout(function(){
				song_recurse(song,stage)
			}, 5000);
			return console.error(err);
			
		}
		else{
			current_song[stage] = song.substring(song.lastIndexOf('/') + 1);
			console.log("Song Changed");
		}

	});
		
}
function setSong2(user, song, stage){
	stage = stage.toUpperCase();
	if (song.indexOf('.adx') < 0){
		song = song + '.adx';
	}
	if (game_music[stage]){
		var time = new Date();
		if (time.getTime() <= lockout_time[stage]){
			console.log('Still Locked');
			client.emit('res', false, user, stage+" cannot be changed for "+(lockout_time[stage]-time.getTime())/1000 +" Seconds");
			return;
		}
		if (tag_list.indexOf(song.slice(0,-4)) >= 0){
			song = song.slice(0,-4);
			var song_choices = song_map.filter(function(item, index, array){
				if (item.tags.indexOf(song) >= 0){
					return true;
				}
				else{
					return false;
				}
			});
			var r_choice = Math.floor(Math.random() * (song_choices.length));
			var song_choice = song_choices[r_choice].dir+song_choices[r_choice].title;

			fs.copy(songs_dir+'/'+song_choice, music_dir+'/'+game_music[stage]+".adx", function(err){
				if (err) {
					setTimeout(function(){
						song_recurse(song_choice,stage)
					}, 5000);
					client.emit('res', true, user, 'Changing song when available.');
					console.error(err);
			
					
				}
				else{
					current_song[stage] = song_choices[r_choice].title;
					client.emit('res', true, user, 'Song Changed');
				}
				lockout_time[stage] = time.getTime() + (1000*60*2);
				console.log("Song Changed");
			})
			
		}
		else if ( (song_choice = song_map.filter(function(item, index, array){
				if (item.title ==  song){
					return true;
				}
				else{
					return false;
				}
			}) ).length > 0){
			song = song_choice[0].dir+song_choice[0].title;
			console.log(song);
			fs.copy(songs_dir+'/'+song, music_dir+'/'+game_music[stage]+".adx", function(err){
				if (err) {
					setTimeout(function(){
						song_recurse(song,stage)
					}, 5000);
					client.emit('res', true, user, 'Changing song when available.');
					console.error(err);
					
				}
				else{
					current_song[stage] = song_choice[0].title;
					client.emit('res', true, user, 'Song Changed');
					
				}
				lockout_time[stage] = time.getTime() + (1000*60*2);
				console.log("Song Changed");
			})
		}

		else{
			client.emit('res', false, user, 'Song Not Found');
		}
	}
	else{
		client.emit('res', false, user, 'Stage Not Found');
	}
}

function setSong(user, song, stage){
	stage = stage.toUpperCase();
	if (song.indexOf('.adx') < 0){
		song = song + '.adx';
	}
	if (game_music[stage]){
		var time = new Date();
		if (time.getTime() <= lockout_time[stage]){
			console.log('Still Locked');
			client.emit('res', false, user, stage+" cannot be changed for "+(lockout_time[stage]-time.getTime())/1000 +" Seconds");
			return;
		}
		if (song == 'random.adx'){
			var r_choice = Math.floor(Math.random() * (songs.length));
			var song_choice = songs[r_choice];
			console.log(songs[r_choice]);

			fs.copy(songs_dir+'/'+song_choice, music_dir+'/'+game_music[stage]+".adx", function(err){
				if (err) {
					setTimeout(function(){
						song_recurse(song_choice,stage)
					}, 5000);
					client.emit('res', true, user, 'Changing song when available.');
					console.error(err);
			
					
				}
				else{
					client.emit('res', true, user, 'Song Changed');
				}
				lockout_time[stage] = time.getTime() + (1000*60*2);
				console.log("Song Changed");
			})
			
		}
		else if (songs.indexOf(song) >= 0){

			fs.copy(songs_dir+'/'+song, music_dir+'/'+game_music[stage]+".adx", function(err){
				if (err) {
					setTimeout(function(){
						song_recurse(song,stage)
					}, 5000);
					client.emit('res', true, user, 'Changing song when available.');
					console.error(err);
					
				}
				else{
					client.emit('res', true, user, 'Song Changed');
					
				}
				lockout_time[stage] = time.getTime() + (1000*60*2);
				console.log("Song Changed");
			})
		}

		else{
			client.emit('res', false, user, 'Song Not Found');
		}
	}
	else{
		client.emit('res', false, user, 'Stage Not Found');
	}
}
