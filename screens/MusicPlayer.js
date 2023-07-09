import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Image, Text, Animated } from 'react-native';
import Icons from "react-native-vector-icons/Ionicons";
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Slider from '@react-native-community/slider';
import songs from "../model/Data";
import TrackPlayer, {Event, RepeatMode, State, usePlaybackState, useProgress, useTrackPlayerEvents} from "react-native-track-player";

const {width, h} = Dimensions.get('window');

const setupPlayer = async() => {
  try {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.add(songs);
  } catch (e) {
    console.log(e);
  }
}

async function togglePlayBack(playBackState) {
  const currentSong = await TrackPlayer.getCurrentTrack();
  if (currentSong != null) {
    if (playBackState === State.Playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  }
}

const MusicPlayer = () => {
  const playBackState = usePlaybackState();
  const duration = useProgress();
  const [songIndex, setSongIndex] = useState(0);
  const [trackTitle, setTrackTitle] = useState();
  const [trackArtwork, setTrackArtwork] = useState();
  const [trackArtist, setTrackArtist] = useState();
  const [repeat, setRepeat] = useState('off');

  const scrollX = useRef(new Animated.Value(0)).current;
  const songSlider = useRef(null);

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack !== null) {
      const track = await TrackPlayer.getTrack(event.nextTrack); 
      const {title, artwork, artist} = track;
      setTrackTitle(title);
      setTrackArtwork(artwork);
      setTrackArtist(artist);
    } 
  });

  const repeatMode = () => {
    if (repeat == 'off') {
      return 'repeat-off';
    }

    if (repeat == 'track') {
      return 'repeat-once';
    }

    if (repeat == 'repeat') {
      return 'repeat';
    }
  };

  const changeRepeatMode = () => {
    if (repeat == 'off') {
      TrackPlayer.setRepeatMode(RepeatMode.Track);
      setRepeat('track');
    }

    if (repeat == 'track') {
      TrackPlayer.setRepeatMode(RepeatMode.Queue);
      setRepeat('repeat');
    }

    if (repeat == 'repeat') {
      TrackPlayer.setRepeatMode(RepeatMode.Off);
      setRepeat('off');
    }
  }

  const skipTo = async trackId => {
    await TrackPlayer.skip(trackId);
  };

  useEffect(() => {
    setupPlayer();
    scrollX.addListener(({value}) => {
      const index = Math.round(value/width);
      skipTo(index);
      setSongIndex(index);
    })
  }, []);

  const nextSong = () => {
    songSlider.current.scrollToOffset({
      offset: (songIndex + 1) * width,
    })
  };

  const prevSong = () => {
    songSlider.current.scrollToOffset({
      offset: (songIndex - 1) * width,
    })
  };

  const fetchSongs = ({item, index}) => {
    return (
      <Animated.View style={style.totalImageWrapper}>
        <View style={[style.imageContainer, style.elevation]}>
          <Image source={trackArtwork} style={style.musicImage} />
        </View>
      </Animated.View>
    );
  }

  return (
    <SafeAreaView style={style.container}>
      <View style={style.mainContainer}>
        {/* FlatList */}
        <Animated.FlatList
          ref={songSlider}
          renderItem={fetchSongs}
          data={songs}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator = {false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {x: scrollX}
                  }
                }
              ],
              {useNativeDriver: true},
            )
          }
        >
        </Animated.FlatList>

        {/* Song Details */}
        <View>
          <Text style={[style.songContainer, style.songTitle]}>{trackTitle}</Text>
          <Text style={[style.songContainer, style.songArtist]}>{trackArtist}</Text>
        </View>

        {/* Slider */}
        <View>
          <Slider
            style={style.sliderBar}
            value={duration.position}
            minimumValue={0}
            maximumValue={duration.duration}
            thumbTintColor='##009FF9'
            minimumTrackTintColor="##009FF9"
            maximumTrackTintColor="#000000"
            onSlidingComplete={async value => {
              await TrackPlayer.seekTo(value);
            }}>
          </Slider>

          {/* Music Time */}
          <View style={style.songTime}>
            <Text style={style.songTimeText}>
              {new Date(duration.position * 1000).toLocaleTimeString().substring(3).slice(0, -2)}
            </Text>
            <Text style={style.songTimeText}>
              {new Date((duration.duration - duration.position) * 1000).toLocaleTimeString().substring(3).slice(0, -2)}
            </Text>
          </View>
        </View>

        {/* Music Control */}
        <View style={style.controls}>
          <TouchableOpacity onPress={prevSong}>
            <Icons name='ios-play-skip-back-outline' size={30}></Icons>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=> togglePlayBack(playBackState)}>
            <Icons name={playBackState === State.Playing ? 'ios-pause-circle' : 'ios-play-circle'} size={50}></Icons>
          </TouchableOpacity>    
          <TouchableOpacity onPress={nextSong}>
            <Icons name='ios-play-skip-forward-outline' size={30}></Icons>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bootom Icon Bar */}
      <View style={style.bottomContainer}>
        <View style={style.bottomIconBar}>
          <TouchableOpacity onPress={()=>{}}>
            <Icons name='heart-outline' size={30}></Icons>
          </TouchableOpacity>
          <TouchableOpacity onPress={changeRepeatMode}>
            <MaterialIcon
              name={`${repeatMode()}`}
              size={30}
              color={repeat !== 'off' ? '#FF9E00' : '#000000'}
            >
            </MaterialIcon>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{}}>
            <Icons name='share-outline' size={30}></Icons>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{}}>
            <Icons name='md-menu-outline' size={30}></Icons>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default MusicPlayer

const style = StyleSheet.create({
    container: {
        flex: 1,
    },

    mainContainer: {
       flex: 1,
       alignItems: 'center',
       justifyContent: 'center'
    },

    bottomContainer: {
      width: width,
      alignItems: 'center',
      paddingVertical: 15,
      borderWidth: 1,
      borderTopColor: '#000'
    },

    bottomIconBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '80%'
    },

    totalImageWrapper: {
      width: width,
      justifyContent: 'center',
      alignItems: 'center'
    },

    imageContainer: {
      width: 300,
      height: 340,
      marginBottom: 15
    },

    elevation: {
      elevation: 5
    },

    musicImage: {
      width: '100%',
      height: '100%',
      borderRadius: 15,
    },

    songContainer: {
      textAlign: 'center',
      color: '#000'
    },

    songTitle: {
      fontSize: 20,
      fontWeight: '600',
    },

    songArtist: {
      fontSize: 16,
      fontWeight: '300',
    },

    sliderBar: {
      width: 350,
      height: 40,
      marginTop: 25,
      flexDirection: 'row'
    },

    songTime: {
      width: 340,
      flexDirection: 'row',
      justifyContent: 'space-between'
    },

    songTimeText: {
      color: '#000',
      fontWeight: '500'
    },

    controls: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '50%',
      marginBottom: 20
    }
})