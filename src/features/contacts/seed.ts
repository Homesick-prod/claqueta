import { Department, PositionRef } from './model';

export const DEFAULT_DEPARTMENTS: Department[] = [
  { id: 'production', name: 'Production' },
  { id: 'direction', name: 'Direction' },
  { id: 'writing-previz', name: 'Writing & Previz' },
  { id: 'camera', name: 'Camera' },
  { id: 'lighting-electric', name: 'Lighting & Electric' },
  { id: 'grip', name: 'Grip' },
  { id: 'sound', name: 'Sound' },
  { id: 'art', name: 'Art' },
  { id: 'wardrobe', name: 'Wardrobe' },
  { id: 'hair-makeup', name: 'Hair & Makeup' },
  { id: 'locations', name: 'Locations' },
  { id: 'casting', name: 'Casting' },
  { id: 'stunts', name: 'Stunts' },
  { id: 'vfx', name: 'VFX' },
  { id: 'sfx', name: 'SFX (Practical)' },
  { id: 'transport', name: 'Transport' },
  { id: 'aerial', name: 'Aerial' },
  { id: 'safety-medic', name: 'Safety & Medic' },
  { id: 'marine', name: 'Marine' },
  { id: 'editorial-post', name: 'Editorial & Post' },
  { id: 'epk-bts', name: 'EPK & BTS' },
  { id: 'accounting', name: 'Accounting' },
  { id: 'legal', name: 'Legal' },
  { id: 'security', name: 'Security' },
  { id: 'education', name: 'Education' },
  { id: 'animals', name: 'Animals' },
  { id: 'armory', name: 'Armory' }
];

export const DEFAULT_POSITIONS: PositionRef[] = [
  // Production
  { id: 'executive-producer', name: 'Executive Producer', departmentId: 'production' },
  { id: 'producer', name: 'Producer', departmentId: 'production' },
  { id: 'co-producer', name: 'Co-Producer', departmentId: 'production' },
  { id: 'associate-producer', name: 'Associate Producer', departmentId: 'production' },
  { id: 'line-producer', name: 'Line Producer', departmentId: 'production' },
  { id: 'unit-production-manager', name: 'Unit Production Manager (UPM)', departmentId: 'production' },
  { id: 'production-manager', name: 'Production Manager', departmentId: 'production' },
  { id: 'production-coordinator', name: 'Production Coordinator', departmentId: 'production' },
  { id: 'assistant-production-coordinator', name: 'Assistant Production Coordinator', departmentId: 'production' },
  { id: 'production-secretary', name: 'Production Secretary', departmentId: 'production' },
  { id: 'office-pa', name: 'Office PA', departmentId: 'production' },
  { id: 'unit-manager', name: 'Unit Manager', departmentId: 'production' },
  { id: 'unit-supervisor', name: 'Unit Supervisor', departmentId: 'production' },
  { id: 'craft-service', name: 'Craft Service', departmentId: 'production' },
  { id: 'catering', name: 'Catering', departmentId: 'production' },
  { id: 'runner', name: 'Runner', departmentId: 'production' },

  // Direction
  { id: 'director', name: 'Director', departmentId: 'direction' },
  { id: '2nd-unit-director', name: '2nd Unit Director', departmentId: 'direction' },
  { id: '1st-ad', name: '1st Assistant Director', departmentId: 'direction' },
  { id: '2nd-ad', name: '2nd Assistant Director', departmentId: 'direction' },
  { id: '3rd-ad', name: '3rd Assistant Director', departmentId: 'direction' },
  { id: 'ad-trainee', name: 'AD Trainee', departmentId: 'direction' },
  { id: 'script-supervisor', name: 'Script Supervisor', departmentId: 'direction' },

  // Writing & Previz
  { id: 'screenwriter', name: 'Screenwriter', departmentId: 'writing-previz' },
  { id: 'script-editor', name: 'Script Editor', departmentId: 'writing-previz' },
  { id: 'storyboard-artist', name: 'Storyboard Artist', departmentId: 'writing-previz' },
  { id: 'concept-artist', name: 'Concept Artist', departmentId: 'writing-previz' },
  { id: 'previz-artist', name: 'Previz Artist', departmentId: 'writing-previz' },
  { id: 'researcher', name: 'Researcher', departmentId: 'writing-previz' },

  // Camera
  { id: 'dop', name: 'Director of Photography (DoP)', departmentId: 'camera' },
  { id: 'camera-operator', name: 'Camera Operator', departmentId: 'camera' },
  { id: 'b-camera-operator', name: 'B-Camera Operator', departmentId: 'camera' },
  { id: 'steadicam-operator', name: 'Steadicam Operator', departmentId: 'camera' },
  { id: '1st-ac', name: '1st Assistant Camera (Focus Puller)', departmentId: 'camera' },
  { id: '2nd-ac', name: '2nd Assistant Camera (Clapper/Loader)', departmentId: 'camera' },
  { id: 'loader', name: 'Loader', departmentId: 'camera' },
  { id: 'dit', name: 'DIT', departmentId: 'camera' },
  { id: 'video-assist', name: 'Video Assist', departmentId: 'camera' },
  { id: 'stills-photographer', name: 'Stills Photographer', departmentId: 'camera' },

  // Lighting & Electric
  { id: 'gaffer', name: 'Gaffer', departmentId: 'lighting-electric' },
  { id: 'best-boy-electric', name: 'Best Boy Electric', departmentId: 'lighting-electric' },
  { id: 'electrician', name: 'Electrician', departmentId: 'lighting-electric' },
  { id: 'board-op', name: 'Board Operator', departmentId: 'lighting-electric' },
  { id: 'rigging-gaffer', name: 'Rigging Gaffer', departmentId: 'lighting-electric' },

  // Grip
  { id: 'key-grip', name: 'Key Grip', departmentId: 'grip' },
  { id: 'best-boy-grip', name: 'Best Boy Grip', departmentId: 'grip' },
  { id: 'grip', name: 'Grip', departmentId: 'grip' },
  { id: 'dolly-grip', name: 'Dolly Grip', departmentId: 'grip' },
  { id: 'rigging-grip', name: 'Rigging Grip', departmentId: 'grip' },
  { id: 'technocrane-team', name: 'Technocrane Team', departmentId: 'grip' },

  // Sound
  { id: 'prod-sound-mixer', name: 'Production Sound Mixer', departmentId: 'sound' },
  { id: 'boom-operator', name: 'Boom Operator', departmentId: 'sound' },
  { id: 'sound-utility', name: 'Sound Utility', departmentId: 'sound' },

  // Art
  { id: 'production-designer', name: 'Production Designer', departmentId: 'art' },
  { id: 'art-director', name: 'Art Director', departmentId: 'art' },
  { id: 'assistant-art-director', name: 'Assistant Art Director', departmentId: 'art' },
  { id: 'set-designer', name: 'Set Designer', departmentId: 'art' },
  { id: 'construction-manager', name: 'Construction Manager', departmentId: 'art' },
  { id: 'carpenter', name: 'Carpenter', departmentId: 'art' },
  { id: 'scenic-artist', name: 'Scenic Artist', departmentId: 'art' },
  { id: 'set-dresser', name: 'Set Dresser', departmentId: 'art' },
  { id: 'props-master', name: 'Props Master', departmentId: 'art' },
  { id: 'props-assistant', name: 'Props Assistant', departmentId: 'art' },
  { id: 'standby-props', name: 'Standby Props', departmentId: 'art' },
  { id: 'greensman', name: 'Greensman', departmentId: 'art' },

  // Wardrobe
  { id: 'costume-designer', name: 'Costume Designer', departmentId: 'wardrobe' },
  { id: 'wardrobe-supervisor', name: 'Wardrobe Supervisor', departmentId: 'wardrobe' },
  { id: 'cutter-tailor', name: 'Cutter/Tailor', departmentId: 'wardrobe' },
  { id: 'dresser', name: 'Dresser', departmentId: 'wardrobe' },
  { id: 'sfx-costume', name: 'SFX Costume', departmentId: 'wardrobe' },

  // Hair & Makeup
  { id: 'key-makeup', name: 'Key Makeup', departmentId: 'hair-makeup' },
  { id: 'makeup-artist', name: 'Makeup Artist', departmentId: 'hair-makeup' },
  { id: 'hair-stylist', name: 'Hair Stylist', departmentId: 'hair-makeup' },
  { id: 'sfx-makeup', name: 'SFX Makeup', departmentId: 'hair-makeup' },
  { id: 'intimacy-coordinator', name: 'Intimacy Coordinator', departmentId: 'hair-makeup' },

  // Locations
  { id: 'location-manager', name: 'Location Manager', departmentId: 'locations' },
  { id: 'assistant-location-manager', name: 'Assistant Location Manager', departmentId: 'locations' },
  { id: 'location-scout', name: 'Location Scout', departmentId: 'locations' },
  { id: 'location-assistant', name: 'Location Assistant', departmentId: 'locations' },
  { id: 'location-security', name: 'Location Security', departmentId: 'locations' },

  // Casting
  { id: 'casting-director', name: 'Casting Director', departmentId: 'casting' },
  { id: 'casting-assistant', name: 'Casting Assistant', departmentId: 'casting' },
  { id: 'talent-coordinator', name: 'Talent Coordinator', departmentId: 'casting' },

  // Stunts
  { id: 'stunt-coordinator', name: 'Stunt Coordinator', departmentId: 'stunts' },
  { id: 'stunt-performer', name: 'Stunt Performer', departmentId: 'stunts' },
  { id: 'fight-choreographer', name: 'Fight Choreographer', departmentId: 'stunts' },

  // VFX
  { id: 'vfx-supervisor', name: 'VFX Supervisor', departmentId: 'vfx' },
  { id: 'vfx-producer', name: 'VFX Producer', departmentId: 'vfx' },
  { id: 'onset-vfx-supervisor', name: 'On-set VFX Supervisor', departmentId: 'vfx' },
  { id: 'vfx-data-wrangler', name: 'VFX Data Wrangler', departmentId: 'vfx' },

  // SFX
  { id: 'sfx-supervisor', name: 'SFX Supervisor', departmentId: 'sfx' },
  { id: 'sfx-technician', name: 'SFX Technician', departmentId: 'sfx' },

  // Transport
  { id: 'transport-captain', name: 'Transport Captain', departmentId: 'transport' },
  { id: 'transport-coordinator', name: 'Transport Coordinator', departmentId: 'transport' },
  { id: 'unit-driver', name: 'Unit Driver', departmentId: 'transport' },
  { id: 'talent-driver', name: 'Talent Driver', departmentId: 'transport' },

  // Aerial
  { id: 'drone-pilot', name: 'Drone Pilot', departmentId: 'aerial' },
  { id: 'drone-cam-op', name: 'Drone Camera Operator', departmentId: 'aerial' },

  // Safety & Medic
  { id: 'safety-supervisor', name: 'Safety Supervisor', departmentId: 'safety-medic' },
  { id: 'set-medic', name: 'Set Medic', departmentId: 'safety-medic' },

  // Marine
  { id: 'marine-coordinator', name: 'Marine Coordinator', departmentId: 'marine' },
  { id: 'water-safety', name: 'Water Safety', departmentId: 'marine' },

  // Editorial & Post
  { id: 'post-supervisor', name: 'Post Supervisor', departmentId: 'editorial-post' },
  { id: 'editor', name: 'Editor', departmentId: 'editorial-post' },
  { id: 'assistant-editor', name: 'Assistant Editor', departmentId: 'editorial-post' },
  { id: 'colorist', name: 'Colorist', departmentId: 'editorial-post' },
  { id: 're-recording-mixer', name: 'Re-recording Mixer', departmentId: 'editorial-post' },
  { id: 'sound-designer', name: 'Sound Designer', departmentId: 'editorial-post' },
  { id: 'sfx-editor', name: 'SFX Editor', departmentId: 'editorial-post' },
  { id: 'foley-artist', name: 'Foley Artist', departmentId: 'editorial-post' },
  { id: 'composer', name: 'Composer', departmentId: 'editorial-post' },
  { id: 'music-supervisor', name: 'Music Supervisor', departmentId: 'editorial-post' },
  { id: 'subtitler', name: 'Subtitler', departmentId: 'editorial-post' },

  // EPK & BTS
  { id: 'epk-producer', name: 'EPK Producer', departmentId: 'epk-bts' },
  { id: 'bts-videographer', name: 'BTS Videographer', departmentId: 'epk-bts' },
  { id: 'bts-photographer', name: 'BTS Photographer', departmentId: 'epk-bts' },
  { id: 'unit-publicist', name: 'Unit Publicist', departmentId: 'epk-bts' },

  // Accounting
  { id: 'production-accountant', name: 'Production Accountant', departmentId: 'accounting' },
  { id: 'assistant-accountant', name: 'Assistant Accountant', departmentId: 'accounting' },
  { id: 'payroll-accountant', name: 'Payroll Accountant', departmentId: 'accounting' },

  // Legal
  { id: 'clearance-coordinator', name: 'Clearance Coordinator', departmentId: 'legal' },
  { id: 'legal-counsel', name: 'Legal Counsel', departmentId: 'legal' },

  // Security
  { id: 'security-chief', name: 'Security Chief', departmentId: 'security' },
  { id: 'crowd-control', name: 'Crowd Control', departmentId: 'security' },

  // Education
  { id: 'studio-teacher', name: 'Studio Teacher', departmentId: 'education' },
  { id: 'chaperone', name: 'Chaperone', departmentId: 'education' },

  // Animals
  { id: 'animal-coordinator', name: 'Animal Coordinator', departmentId: 'animals' },
  { id: 'animal-wrangler', name: 'Animal Wrangler', departmentId: 'animals' },

  // Armory
  { id: 'armorer', name: 'Armorer', departmentId: 'armory' }
];