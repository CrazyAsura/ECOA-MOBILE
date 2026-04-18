import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Motion } from '@legendapp/motion';

interface ProfileFrameProps {
  photoUrl?: string;
  frameUrl?: string;
  size?: number;
}

export const ProfileFrame = ({ photoUrl, frameUrl, size = 120 }: ProfileFrameProps) => {
  const padding = size * 0.12;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Background/Photo */}
      <View style={[styles.photoWrapper, { borderRadius: size / 2, padding }]}>
        <Image 
          source={{ uri: photoUrl || 'https://i.pravatar.cc/300' }} 
          style={[styles.photo, { borderRadius: size / 2 }]} 
        />
      </View>

      {/* Frame Overlay */}
      {frameUrl && (
        <Motion.Image 
          initial={{ rotate: -10, scale: 0.9 }}
          animate={{ rotate: 0, scale: 1 }}
          source={{ uri: frameUrl }} 
          style={[styles.frame, { width: size, height: size }]} 
        />
      )}

      {/* Default Cinematic Glow for high level */}
      {!frameUrl && (
        <View style={[styles.glow, { width: size, height: size, borderRadius: size / 2 }]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { justifyContent: 'center', alignItems: 'center' },
  photoWrapper: { width: '100%', height: '100%', overflow: 'hidden', backgroundColor: '#1A1A1A' },
  photo: { width: '100%', height: '100%' },
  frame: { position: 'absolute', zIndex: 2 },
  glow: { position: 'absolute', borderWidth: 2, borderColor: '#00FF9C', opacity: 0.3, zIndex: 1 }
});
