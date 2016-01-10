/*jshint jquery: true*/

//
// ResentStats for Javascript
//  Author: prince-0203<https://github.com/prince-0203>
//  Require: jQuery<https://jquery.com/>, sprintf.js<https://github.com/alexei/sprintf.js>
//
// ResentStats<https://gist.github.com/nanashell2055/489cdd33deb0fe39eaa1> をJavascriptに移植・一部改変、新APIに対応させたものです。
// APIからのユーザーデータの取得処理は入れていません。適当に取得して引数に渡してください。
// どうやらプレイ時間を正常に取得できていないようで、効率を正しく計算できていませんがご了承ください。
//

//
// Class Recentstats
//  string execute(object data)
//   object data: 新APIから取得したユーザー情報のObject(取得する際、fieldにはtotal,matches,objective,ctwを必ず指定すること(それ以外を含んでいても構わない)。また、JSONをそのまま渡さないこと。)
//   ResentStatsを計算し、結果を返します。エラーが発生した場合、nullを返します。
//
//  (他の関数はexecuteの内部で使用しているだけなので使う意味はないです)
//

var RecentStats = {
	execute: function(data) {
		if(typeof(data.last_login) !== 'string') {
			// データが不正だった
			return null;
		} else {
			var result = {
				kill: 0,
				death: 0,
				env_death: 0,
				matches: {
					total: 0,
					win: 0,
					lose: 0,
					draw: 0
				},
				obj: 0,
				played_time: 0,
				boundary: 0
			};

			$.each(data.matches, function(i) {
				if(this.gamemode !== 'paintball' && this.gamemode !== 'splatt' && this.gamemode !== 'blitz') {
					// Kill and death
					result.kill += this.kill_count;
					result.death += this.death_count;
					result.env_death += this.envdeath_count;
					// Match Result
					result.matches.total++;
					result.matches[this.result]++;
					// Match Time
					var playTime = Date.parse(this.finished) - Date.parse(this.started);
					console.log('Start: ' + this.started + '(' + Date.parse(this.started) + '), ' +
						'Finished: ' + this.finished + '(' + Date.parse(this.finished) + '), ' + playTime + 's(' + playTime / 60 + 'm)');
					if(playTime < 2000) {
						result.played_time += playTime;
					}/* else {
						console.log('err(' + i + '): started ' + new Date(this.started).getTime() + ', finished: ' + new Date(this.finished).getTime());
					}*/

					if(result.boundary === 0) {
						result.boundary = Date.parse(this.started);
					}
				}
			});

			// objectives
			$.each(data.objective.destroys, function() {
				if(Date.parse(this.time) > result.boundary) {
					result.obj++;
				}
			});

			$.each(data.objective.core_leaks, function() {
				if(Date.parse(this.time) > result.boundary) {
					result.obj++;
				}
			});

			$.each(data.ctw.wool_places, function() {
				if(Date.parse(this.time) > result.boundary) {
					result.obj++;
				}
			});

			//console.log(result.played_time);

			var status = sprintf("%s の直近%d試合の戦績統計\nK: %d D: %d\nK/K: %s K/D: %s\n%sKill/h %sDeath/h %sObj/h\n勝率: %s%% 敗率: %s%%",
                data.name,
                result.matches.total,
                result.kill,
                result.death,
                this.calculationRatio(result.kill, result.death),
                this.calculationRatio(result.kill, (result.death + result.env_death)),
                this.calculationEfficient(result.kill, result.played_time),
                this.calculationEfficient(result.death, result.played_time),
                this.calculationEfficient(result.obj, result.played_time),
                this.calculationPercent(result.matches.win, result.matches.lose),
                this.calculationPercent(result.matches.lose, result.matches.win)
            );

            return status;
		}
	},

	round: function(foo, bar) {
		return Math.round(foo * Math.pow(10, bar)) / Math.pow(10, bar);
	},

	calculationRatio: function(foo, bar) {
        if(foo !== 0) {
            if(bar === 0) {
                bar = 1;
            }
            return this.round(foo / bar, 3);
        } else {
            return 0;
        }
    },

    calculationEfficient: function(foo, time) {
        if (foo === 0) {
            return 0;
        } else {
            return this.round(foo * (3600 / time), 2);
        }
    },

    calculationPercent: function(foo , bar) {
        return this.round(foo / (foo + bar) * 100, 1);
    }
};