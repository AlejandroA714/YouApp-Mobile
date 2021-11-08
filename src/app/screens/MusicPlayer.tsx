import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  Image,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Slider from '@react-native-community/slider';
//Styles
import TrackPlayer, {
  usePlaybackState,
  State,
  useProgress,
  Track,
  Event,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import Colors from '@src/styles/Colors';
import AppPlayer from '../modules/player/AppPlayer';

const {width} = Dimensions.get('window');

const MusicScreen = () => {
  let playbackState = usePlaybackState();
  const {position, duration} = useProgress();
  const [track, setTrack] = useState<Track>();

  const setup = async () => {
    try {
      await AppPlayer.initializePlayer();
      await TrackPlayer.add([
        {
          url: 'http://192.168.101.2:9090/youapp/049d1e78-bebb-4541-835d-a86def2460d0_1636089824.mp3',
          title: 'Sweather Weather',
          artist: 'The Neighbourhood',
          album: 'Album 1',
          duration: 247.2,
        },
        {
          url: 'http://192.168.101.2:9090/youapp/53603788-944c-4cc3-b39d-874436eff601_1636327932.mp3',
          title: 'Lets Kill Tonight',
          artist: 'Panic! At Disco',
          album: 'Album 1',
          duration: 199.8,
        },
      ]);
    } catch (e) {
      console.log(e);
    }
  };

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
      console.log(event);
      const dd: Track = await TrackPlayer.getTrack(event.nextTrack);
      setTrack(dd);
    }
  });

  useEffect(() => {
    setup();
    return () => TrackPlayer.destroy();
  }, []);

  const play = async () => {
    if (playbackState === State.Playing) {
      console.log('pausing');
      await TrackPlayer.pause();
    } else {
      console.log('playing');
      await TrackPlayer.play();
    }
  };

  const next = async () => {
    await TrackPlayer.skipToNext();
  };

  const prev = async () => {
    await TrackPlayer.skipToPrevious();
  };

  return (
    <>
      <StatusBar backgroundColor={Colors.BACKGROUND} />
      <SafeAreaView style={styles.container}>
        <View style={styles.maiContainer}>
          <View style={styles.artworkWrapper}>
            <Image
              style={styles.artworkImg}
              source={require('@assets/good.jpg')}
            />
          </View>
          <View>
            <Text style={styles.title}>{track?.title}</Text>
            <Text style={styles.artist}>{track?.artist}</Text>
          </View>
          <View>
            <Slider
              style={styles.progressContainer}
              value={position}
              minimumValue={0}
              maximumValue={duration}
              thumbTintColor="#00CB34"
              minimumTrackTintColor="#00CB34"
              maximumTrackTintColor="#fff"
              onSlidingComplete={async p => await TrackPlayer.seekTo(p)}
            />
          </View>
          <View style={styles.progressLabelContainer}>
            <Text style={styles.ProgressLabelTxt}>
              {AppPlayer.secondsToHHMMSS(position)}
            </Text>
            <Text style={styles.ProgressLabelTxt}>
              {AppPlayer.secondsToHHMMSS(duration)}
            </Text>
          </View>
          <View style={styles.musicControlls}>
            <TouchableOpacity onPress={prev}>
              <Ionicons
                name="play-skip-back-outline"
                size={35}
                style={{marginTop: 25}}
                color={Colors.PRIMARY}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={play}>
              <Ionicons
                name={
                  playbackState === State.Playing
                    ? 'ios-pause-circle'
                    : 'ios-play-circle'
                }
                size={75}
                color={Colors.PRIMARY}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={next}>
              <Ionicons
                name="play-skip-forward-outline"
                size={35}
                style={{marginTop: 25}}
                color={Colors.PRIMARY}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.bottomControls}>
            <TouchableOpacity onPress={() => {}}>
              <Ionicons name="heart-outline" size={30} color={Colors.PRIMARY} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <Ionicons name="repeat" size={30} color={Colors.PRIMARY} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <Ionicons name="share-outline" size={30} color={Colors.PRIMARY} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <Ionicons
                name="ellipsis-horizontal-outline"
                size={30}
                color={Colors.PRIMARY}
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#220037',
  },

  maiContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  artworkWrapper: {
    width: 300,
    height: 340,
    marginBottom: 25,

    shadowColor: '#ccc',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,

    elevation: 5,
  },

  artworkImg: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.ACCENT,
  },

  artist: {
    fontSize: 16,
    fontWeight: '200',
    textAlign: 'center',
    color: Colors.ACCENT,
  },

  progressContainer: {
    width: 350,
    height: 40,
    marginTop: 25,
    flexDirection: 'row',
  },

  progressLabelContainer: {
    width: 320,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  ProgressLabelTxt: {
    color: Colors.GRAY5,
  },

  musicControlls: {
    flexDirection: 'row',
    width: '60%',
    justifyContent: 'space-between',
    marginTop: 15,
  },

  bottomContainer: {
    borderTopColor: Colors.GRAY2,
    borderTopWidth: 1,
    width: width,
    alignItems: 'center',
    paddingVertical: 15,
  },

  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
});

export {MusicScreen};
