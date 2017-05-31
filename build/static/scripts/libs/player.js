/*!
 *  Howler.js Audio Player Demo
 *  howlerjs.com
 *
 *  (c) 2013-2017, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */

 $('.hc-card').each(function(i){
   // Cache references to DOM elements.
   var playBtn = $(this).find('.playBtn');
   var track = $(this).find('.track');
   var timer = $(this).find('.timer');
   var pauseBtn = $(this).find('.pauseBtn');
   var progress = $(this).find('.progress');
   var bar = $(this).find('.bar');
   var scrubber = $(this).find('.scrubber');
   var duration = $(this).find('.duration');
   var subtitles = $(this).find('.subtitles');

   var name = $(this).data('card');


   /**
    * Player class containing the state of our playlist and where we are in it.
    * Includes all methods for playing, skipping, updating the display, etc.
    * @param {Array} playlist Array of objects with playlist song details ({title, audio, howl}).
    */
   var Player = function(playlist) {
     this.playlist = playlist;
     this.index = i;

     // Display the title of the first track.
   //   $(track).html(playlist[i].title);
   };
   Player.prototype = {
     /**
      * Play a song in the playlist.
      * @param  {Number} index Index of the song in the playlist (leave empty to play the first or current).
      */
     play: function(index) {
       var self = this;
       var sound;

       index = typeof index === 'number' ? index : self.index;
       var data = self.playlist[index];

       // If we already loaded this track, use the current one.
       // Otherwise, setup and load a new Howl.
       if (data.howl) {
         sound = data.howl;
       } else {
         sound = data.howl = new Howl({
           src: ['static/assets/audio/' + data.audio + '.mp3'],
           html5: true, // Force to HTML5 so that the audio can stream in (best for large audios).
           onplay: function() {
             // Display the duration.
             $(duration).html(self.formatTime(Math.round(sound.duration())));

             // Start upating the progress of the track.
             requestAnimationFrame(self.step.bind(self));

             // bar.style.display = 'none';
             $(pauseBtn).show();
           },
           onload: function() {
             // Start the scrubber animation.
             $(bar).hide();
           },
           onend: function() {
             // Stop the scrubber animation.
             $(bar).show();
             self.skip('right');
           },
           onpause: function() {
             // Stop the scrubber animation.
             $(bar).show();
           },
           onstop: function() {
             // Stop the scrubber animation.
             $(bar).show();
           }
         });
       }

       // Begin playing the sound.
       sound.play();

       // Update the track display.
      //  $(track).html(data.title);
      //  track.innerHTML =  data.title;

       // Show the pause button.
       if (sound.state() === 'loaded') {
          $(playBtn).hide();
          $(pauseBtn).show();

       } else {
          $(playBtn).hide();
          $(pauseBtn).hide();
       }

       // Keep track of the index we are currently playing.
       self.index = index;
     },

     /**
      * Pause the currently playing track.
      */
     pause: function() {
       var self = this;

       // Get the Howl we want to manipulate.
       var sound = self.playlist[self.index].howl;

       // Puase the sound.
       sound.pause();

       // Show the play button.
       $(playBtn).show();
       $(pauseBtn).hide();
     },

     /**
      * Seek to a new position in the currently playing track.
      * @param  {Number} per Percentage through the song to skip.
      */
     seek: function(per) {
       var self = this;

       // Get the Howl we want to manipulate.
       var sound = self.playlist[self.index].howl;

       // Convert the percent into a seek position.
       if (sound.playing()) {
         sound.seek(sound.duration() * per);
       }


     },

     /**
      * The step called within requestAnimationFrame to update the playback position.
      */
     step: function() {
       var self = this;

       // Get the Howl we want to manipulate.
       var sound = self.playlist[self.index].howl;

       // Determine our current seek position.
       var seek = sound.seek() || 0;

       $(timer).html(self.formatTime(Math.round(seek)));

       var json = 'static/assets/subtitles/' + name + '.json';

       $.getJSON(json, function(transcript) {
          for (var i = 0; i < transcript.length; i++) {
               if (transcript[i]['startTime'] < seek && transcript[i]['endTime'] > seek ) {
                $(subtitles).html(transcript[i]['text']);
               }
          }
      });

       var progressWidth = (((seek / sound.duration()) * 100) || 0) + '%';
       $(progress).css({
          width: progressWidth
       });

       // If the sound is still playing, continue stepping.
       if (sound.playing()) {
         requestAnimationFrame(self.step.bind(self));
       }
     },

     /**
      * Format the time from seconds to M:SS.
      * @param  {Number} secs Seconds to format.
      * @return {String}      Formatted time.
      */
     formatTime: function(secs) {
       var minutes = Math.floor(secs / 60) || 0;
       var seconds = (secs - minutes * 60) || 0;

       return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
     }
   };

   // Setup our new audio player class and pass it the playlist.
   var player = new Player([
     {
         "audio": "dia",
         "howl": null
     },
     {
         "audio": "scott",
         "howl": null
     },
     {
         "audio": "nicole",
         "howl": null
     },
     {
         "audio": "clark",
         "howl": null
     },
     {
         "audio": "dianet",
         "howl": null
     },
     {
         "audio": "kristen",
         "howl": null
     },
     {
         "audio": "mary",
         "howl": null
     },
     {
         "audio": "vicki",
         "howl": null
     },
     {
         "audio": "sally",
         "howl": null
     }
   ]);

   // Bind our player controls.
   $(playBtn).click(function() {
      player.play();
   });

   $(pauseBtn).click(function() {
      player.pause();
   });

   $(scrubber).click(function (event) {
      var scrubberOffset = $(scrubber).offset();
      var mousePos = event.pageX - scrubberOffset.left;
      player.seek(mousePos / $(scrubber).width());
   });
 });
