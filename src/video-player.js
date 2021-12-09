define([
  "skylark-langx",
  "skylark-domx-styler",
  "skylark-domx-noder",
  "skylark-domx-eventer",
  "skylark-domx-medias",
  "skylark-domx-query",
  "skylark-domx-plugins-base",
  "skylark-domx-plugins-toggles/fullscreen",
  "skylark-domx-plugins-toggles/Pip",
  "./players",
  "./play-control",
  "./playback-animation",
  "./progress-control",
  "./time-control",
  "./volume-control"
],function(langx,styler,noder, eventer,medias,$ , plugins,Fullscreen,Pip,players,PlayControl,PlaybackAnimation,ProgressControl,TimeControl,VolumeControl) {

  'use strict'

  var VideoPlayer = plugins.Plugin.inherit({
    klassName : "VideoPlayer",

    pluginName : "domx.players.video",
   
    options : {
      selectors : {
        video : 'video',
        videoControls : '.video-controls',

        playButton : '.play-button',
        playbackIcons : '.playback-icons use',

        timeControl : ".time",
        timeElapsed : '.time-elapsed',
        duration : '.duration',

        progressControl : ".video-progress",
        progressBar : '.progress-bar',
        seek : '.seek',
        seekTooltip : '.seek-tooltip',

        volumeControl : ".volume-control",
        volumeButton : '.volume-button',
        volumeIcons : '.volume-button use',
        volumeMute : 'use[href="#volume-mute"]',
        volumeLow : 'use[href="#volume-low"]',
        volumeHigh : 'use[href="#volume-high"]',
        volume : '.volume',

        playbackAnimation : '.playback-animation',

        fullscreenButton : '.fullscreen-button',
        fullscreenIcons : '.fullscreen-button use',

        pipButton : '.pip-button'

      }
    },


    _construct: function(elm, options) {
      //this.options = options
      plugins.Plugin.prototype._construct.call(this,elm,options);

      let $el = this.$(),
          selectors = this.options.selectors;

      this.$video = this.elmx().find(selectors.video);

      this.$videoControls = $el.find(selectors.videoControls);

      //this._playButton = $el.find(selectors.playButton)[0];
      //this._playbackIcons = $el.find(selectors.playbackIcons);
      this._playControl = PlayControl.instantiate($el.find(selectors.playButton)[0],{
        media : this.$video
      });


      //this._timeElapsed = $el.find(selectors.timeElapsed)[0];
      //this._duration = $el.find(selectors.duration)[0];
      this._timeControl = TimeControl.instantiate($el.find(selectors.timeControl)[0],{
        media : this.$video        
      });
      
      //this._progressBar = $el.find(selectors.progressBar)[0];
      //this._seek = $el.find(selectors.seek)[0];
      //this._seekTooltip = $el.find(selectors.seekTooltip)[0];
      this._progressControl = ProgressControl.instantiate($el.find(selectors.progressControl)[0],{
        media : this.$video        
      });

      //this._volumeButton = $el.find(selectors.volumeButton)[0];
      //this._volumeIcons = $el.find(selectors.volumeIcons);
      //this._volumeMute = $el.find(selectors.volumeMute)[0];
      //this._volumeLow = $el.find(selectors.volumeLow)[0];
      //this._volumeHigh = $el.find(selectors.volumeHigh)[0];
      //this._volume = $el.find(selectors.volume)[0];
      this._volumeControl = VolumeControl.instantiate($el.find(selectors.volumeControl)[0],{
        media : this.$video        
      });
      
      //this._playbackAnimation = $el.find(selectors.playbackAnimation)[0];
      this._playbackAnimation = PlaybackAnimation.instantiate($el.find(selectors.playbackAnimation)[0],{
        media : this.$video        
      });
      
      //this._fullscreenButton = $el.find(selectors.fullscreenButton)[0];
      //this._fullscreenIcons = $el.find(selectors.fullscreenIcons);
      this._fullscreen = Fullscreen.instantiate($el.find(selectors.fullscreenButton)[0],{
        target : this.elmx()
      });
      
      //this._pipButton = $el.find(selectors.pipButton)[0];
      this._pip = Pip.instantiate($el.find(selectors.pipButton)[0],{
        target : this.$video        
      });

      // Add eventlisteners here
      this.listenTo($(this._videoControls),'mouseenter',this.showControls);
      this.listenTo($(this._videoControls),'mouseleave',this.hideControls);
      /*
      this.listenTo($(this._playButton),'click', this.togglePlay);
      this.listenTo($(this._video),'play',this.updatePlayButton);
      this.listenTo($(this._video),'pause',this.updatePlayButton);
      this.listenTo($(this._video),'loadedmetadata',this.initializeVideo);
      this.listenTo($(this._video),'timeupdate',this.updateTimeElapsed);
      this.listenTo($(this._video),'timeupdate',this.updateProgress);
      this.listenTo($(this._video),'volumechange',this.updateVolumeIcon);
      this.listenTo($(this._video),'click',this.togglePlay);
      this.listenTo($(this._video),'click',this.animatePlayback);
      this.listenTo($(this._video),'mouseenter',this.showControls);
      this.listenTo($(this._video),'mouseleave',this.hideControls);
      this.listenTo($(this._seek),'mousemove',this.updateSeekTooltip);
      this.listenTo($(this._seek),'input',this.skipAhead);
      this.listenTo($(this._volume),'input',this.updateVolume);
      this.listenTo($(this._volumeButton),'click',this.toggleMute);
      this.listenTo($(this._fullscreenButton),'click',this.toggleFullScreen);
      this.listenTo($el,'fullscreenchange,webkitfullscreenchange',this.updateFullscreenButton);
      this.listenTo($(this._pipButton),'click',this.togglePip);

      if (!('pictureInPictureEnabled' in document)) {
          this._pipButton.classList.add('hidden');
      }
      */
      this.listenTo($(document),'keyup',this.keyboardShortcuts);
      
      const videoWorks = !!document.createElement('video').canPlayType;
      if (videoWorks) {
        this.$video.controls(false);
        this.$videoControls.show();
      }

      this.load();
    },

    source : function(media) {
      this._media = media;
      let title = media.title || "",
          url = media.href,
          type = media.type,
          posterUrl = media.poster || "",
          altText = media.altText || "";

      let $el = this.$(),
          video = this._video,
          $play = this._$play,
          $poster = this._$poster;

      $el.prop("title", title);
      
      if (video.canPlayType) {
        if (url && type && video.canPlayType(type)) {
          video.src = url
        }    
      }

      video.poster = posterUrl
      
      $poster.prop({
        "src" : posterUrl,
        "alt" : altText
      });

      $play.prop({
        'download' :  title,
        "href" : url
      });
    
    },

    load : function() {
      this.$video.load();
    },

    play : function() {
      this.$video.play();

    },

    stop : function() {
      this.$video.stop();
    },

    pause : function() {
      this.$video.pause();      
    },

    // togglePlay toggles the playback state of the video.
    // If the video playback is paused or ended, the video is played
    // otherwise, the video is paused
    togglePlay : function () {
      if (this.$video.paused() || this.$video.ended()) {
        this.$video.play();
      } else {
        this.$video.pause();
      }
    },


    // hideControls hides the video controls when not in use
    // if the video is paused, the controls must remain visible
    hideControls : function () {
      if (this.$video.paused()) {
        return;
      }

      styler.addClass(this._videoControls,'hide');
    },

    // showControls displays the video controls
    showControls : function () {
      styler.removeClass(this._videoControls,'hide');
    },

    // keyboardShortcuts executes the relevant functions for
    // each supported shortcut key
    keyboardShortcuts : function (event) {
      const { key } = event;
      switch (key) {
        case 'k':
          this.togglePlay();
          this._playbackAnimation.animatePlayback();
          if (this.$video.paused()) {
            this.showControls();
          } else {
            setTimeout(() => {
              this.hideControls();
            }, 2000);
          }
          break;
        case 'm':
          this._volumeControl.toggleMute();
          break;
        case 'f':
          this._fullscreen.toggleFullScreen();
          break;
        case 'p':
          this._pip.togglePip();
          break;
      }
    }    


  });

  plugins.register(VideoPlayer);

  return players.VideoPlayer = VideoPlayer;
});

