import { Department, PositionRef } from './model';

export const DEFAULT_DEPARTMENTS: Department[] = [
  { id: 'directing', name: 'Directing', order: 0 },
  { id: 'assistant-directing', name: 'Assistant Directing', order: 1 },
  { id: 'camera', name: 'Camera', order: 2 },
  { id: 'grip-electric', name: 'Grip & Electric', order: 3 },
  { id: 'sound', name: 'Sound', order: 4 },
  { id: 'art', name: 'Art Department', order: 5 },
  { id: 'wardrobe', name: 'Wardrobe', order: 6 },
  { id: 'makeup', name: 'Hair & Makeup', order: 7 },
  { id: 'production', name: 'Production', order: 8 },
  { id: 'post', name: 'Post-Production', order: 9 },
  { id: 'transport', name: 'Transportation', order: 10 },
  { id: 'locations', name: 'Locations', order: 11 },
  { id: 'vfx', name: 'Visual Effects', order: 12 },
  { id: 'stunts', name: 'Stunts', order: 13 },
  { id: 'catering', name: 'Catering', order: 14 },
  { id: 'other', name: 'Other', order: 15 }
];

export const DEFAULT_POSITIONS: PositionRef[] = [
  // Directing
  { id: 'director', name: 'Director', departmentId: 'directing' },
  { id: 'co-director', name: 'Co-Director', departmentId: 'directing' },
  
  // Assistant Directing
  { id: '1st-ad', name: '1st Assistant Director', departmentId: 'assistant-directing' },
  { id: '2nd-ad', name: '2nd Assistant Director', departmentId: 'assistant-directing' },
  { id: '3rd-ad', name: '3rd Assistant Director', departmentId: 'assistant-directing' },
  { id: 'script-supervisor', name: 'Script Supervisor', departmentId: 'assistant-directing' },
  
  // Camera
  { id: 'dop', name: 'Director of Photography', departmentId: 'camera' },
  { id: 'camera-operator', name: 'Camera Operator', departmentId: 'camera' },
  { id: '1st-ac', name: '1st AC (Focus Puller)', departmentId: 'camera' },
  { id: '2nd-ac', name: '2nd AC (Clapper/Loader)', departmentId: 'camera' },
  { id: 'dit', name: 'DIT', departmentId: 'camera' },
  { id: 'steadicam', name: 'Steadicam Operator', departmentId: 'camera' },
  
  // Grip & Electric
  { id: 'gaffer', name: 'Gaffer', departmentId: 'grip-electric' },
  { id: 'best-boy-electric', name: 'Best Boy Electric', departmentId: 'grip-electric' },
  { id: 'electrician', name: 'Electrician', departmentId: 'grip-electric' },
  { id: 'key-grip', name: 'Key Grip', departmentId: 'grip-electric' },
  { id: 'best-boy-grip', name: 'Best Boy Grip', departmentId: 'grip-electric' },
  { id: 'grip', name: 'Grip', departmentId: 'grip-electric' },
  
  // Sound
  { id: 'sound-mixer', name: 'Sound Mixer', departmentId: 'sound' },
  { id: 'boom-operator', name: 'Boom Operator', departmentId: 'sound' },
  { id: 'sound-assistant', name: 'Sound Assistant', departmentId: 'sound' },
  
  // Art Department
  { id: 'production-designer', name: 'Production Designer', departmentId: 'art' },
  { id: 'art-director', name: 'Art Director', departmentId: 'art' },
  { id: 'set-decorator', name: 'Set Decorator', departmentId: 'art' },
  { id: 'props-master', name: 'Props Master', departmentId: 'art' },
  { id: 'set-dresser', name: 'Set Dresser', departmentId: 'art' },
  { id: 'construction-coordinator', name: 'Construction Coordinator', departmentId: 'art' },
  
  // Wardrobe
  { id: 'costume-designer', name: 'Costume Designer', departmentId: 'wardrobe' },
  { id: 'wardrobe-supervisor', name: 'Wardrobe Supervisor', departmentId: 'wardrobe' },
  { id: 'set-costumer', name: 'Set Costumer', departmentId: 'wardrobe' },
  
  // Hair & Makeup
  { id: 'key-makeup', name: 'Key Makeup Artist', departmentId: 'makeup' },
  { id: 'makeup-artist', name: 'Makeup Artist', departmentId: 'makeup' },
  { id: 'key-hair', name: 'Key Hair Stylist', departmentId: 'makeup' },
  { id: 'hair-stylist', name: 'Hair Stylist', departmentId: 'makeup' },
  
  // Production
  { id: 'producer', name: 'Producer', departmentId: 'production' },
  { id: 'executive-producer', name: 'Executive Producer', departmentId: 'production' },
  { id: 'line-producer', name: 'Line Producer', departmentId: 'production' },
  { id: 'production-manager', name: 'Production Manager', departmentId: 'production' },
  { id: 'production-coordinator', name: 'Production Coordinator', departmentId: 'production' },
  { id: 'production-assistant', name: 'Production Assistant', departmentId: 'production' },
  
  // Post-Production
  { id: 'editor', name: 'Editor', departmentId: 'post' },
  { id: 'assistant-editor', name: 'Assistant Editor', departmentId: 'post' },
  { id: 'colorist', name: 'Colorist', departmentId: 'post' },
  { id: 'sound-designer', name: 'Sound Designer', departmentId: 'post' },
  { id: 'composer', name: 'Composer', departmentId: 'post' },
  
  // Transportation
  { id: 'transport-captain', name: 'Transportation Captain', departmentId: 'transport' },
  { id: 'transport-coordinator', name: 'Transportation Coordinator', departmentId: 'transport' },
  { id: 'driver', name: 'Driver', departmentId: 'transport' },
  
  // Locations
  { id: 'location-manager', name: 'Location Manager', departmentId: 'locations' },
  { id: 'location-scout', name: 'Location Scout', departmentId: 'locations' },
  { id: 'location-assistant', name: 'Location Assistant', departmentId: 'locations' },
  
  // VFX
  { id: 'vfx-supervisor', name: 'VFX Supervisor', departmentId: 'vfx' },
  { id: 'vfx-producer', name: 'VFX Producer', departmentId: 'vfx' },
  { id: 'vfx-coordinator', name: 'VFX Coordinator', departmentId: 'vfx' },
  
  // Stunts
  { id: 'stunt-coordinator', name: 'Stunt Coordinator', departmentId: 'stunts' },
  { id: 'stunt-performer', name: 'Stunt Performer', departmentId: 'stunts' },
  
  // Catering
  { id: 'craft-services', name: 'Craft Services', departmentId: 'catering' },
  { id: 'caterer', name: 'Caterer', departmentId: 'catering' },
  
  // Other
  { id: 'other-crew', name: 'Other Crew', departmentId: 'other' }
];