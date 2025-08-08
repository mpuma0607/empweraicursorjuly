#!/usr/bin/env node

/**
 * Video Update Script
 * 
 * Usage:
 * node scripts/update-videos.js
 * 
 * This script helps you update video links across the site.
 * You can:
 * 1. List all current video links
 * 2. Update specific video links
 * 3. Replace old video IDs with new ones
 */

const fs = require('fs');
const path = require('path');

// Video replacement map - UPDATED WITH USER'S SPECIFIC REQUESTS
const videoReplacements = {
  // SWAP VIDEOS (Replace existing)
  "Blhdk_5WzbY": "Ohw5rq2hIDk",  // FSBO Prospecting Step 1
  "2-Hj6uGfyic": "NMu1cXoOV_M",  // Expired Listings Step 1
  "-iZP4tThjtI": "ix0Ndf-QkGY",  // Buyer Process Overview
  "BDOnxUdsDco": "Bk07tUkPAlA",  // Listing Process Overview
  
  // ADD VIDEOS (These will be added to specific locations)
  // Note: These need manual placement in specific components
  "NEW_SCRIPT_MASTERY": "7dmw0gCQB84",      // Training Hub Script Mastery
  "NEW_PROSPECTING_HUB": "dB9Y2fu_o6E",     // Prospecting Hub Page
  "NEW_SOI_STEP1": "KrLPc_ax_Ho",           // Sphere of Influence Step 1
  "NEW_PROBATE_STEP1": "elBK_YVWf88",       // Probate Step 1
  "NEW_INVESTORS_STEP1": "VOlm5MjE-0w",     // Investors Step 1
  "NEW_FTHB_STEP1": "Djy-19IaxN4",          // First Time Homebuyers Step 1
  "NEW_DIVORCE_STEP1": "F_z3UwL6RoU",       // Divorce Step 1
  "NEW_PRE_FORECLOSURE_STEP1": "XVuxepAtR6M", // Pre-foreclosure Step 1
  "NEW_DISC_ART_OF_CONNECTION": "cK8BCZroyQI", // DISC VAK Art of Connection
  "NEW_PORTAL_HOME": "ayPLCQ_TCU8",          // Portal Home Page (Empower AI only)
};

// Files to search and update
const filesToUpdate = [
  'app/page.tsx',
  'app/portal/page.tsx',
  'app/training-hub/script-mastery/page.tsx',
  'app/training-hub/listing-process/page.tsx',
  'app/training-hub/buyer-process/page.tsx',
  'app/training-hub/disc-vak/page.tsx',
  'app/prospecting-hub/page.tsx',
  'app/prospecting-hub/absentee-owners/page.tsx',
  'app/prospecting-hub/fsbo/page.tsx',
  'app/prospecting-hub/expired-listings/page.tsx',
  'app/prospecting-hub/soi/page.tsx',
  'app/prospecting-hub/probate/page.tsx',
  'app/prospecting-hub/investors/page.tsx',
  'app/prospecting-hub/first-time-buyers/page.tsx',
  'app/prospecting-hub/divorce/page.tsx',
  'app/prospecting-hub/divorce-real-estate/page.tsx',
  'app/prospecting-hub/pre-foreclosure/page.tsx'
];

function findVideoIds(content) {
  const youtubeEmbedRegex = /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/g;
  const youtuBeRegex = /youtu\.be\/([a-zA-Z0-9_-]+)/g;
  
  const embedMatches = [...content.matchAll(youtubeEmbedRegex)];
  const shortMatches = [...content.matchAll(youtuBeRegex)];
  
  const videoIds = new Set();
  
  embedMatches.forEach(match => videoIds.add(match[1]));
  shortMatches.forEach(match => videoIds.add(match[1]));
  
  return Array.from(videoIds);
}

function updateVideoIds(content, replacements) {
  let updatedContent = content;
  
  Object.entries(replacements).forEach(([oldId, newId]) => {
    // Replace in embed URLs
    const embedRegex = new RegExp(`youtube\\.com/embed/${oldId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
    updatedContent = updatedContent.replace(embedRegex, `youtube.com/embed/${newId}`);
    
    // Replace in short URLs
    const shortRegex = new RegExp(`youtu\\.be/${oldId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
    updatedContent = updatedContent.replace(shortRegex, `youtu.be/${newId}`);
  });
  
  return updatedContent;
}

function main() {
  console.log('🎥 Video Update Script - USER REQUESTED UPDATES\n');
  
  // Step 1: List all current video IDs
  console.log('📋 Current Video IDs found across the site:');
  const allVideoIds = new Set();
  
  filesToUpdate.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const videoIds = findVideoIds(content);
      videoIds.forEach(id => allVideoIds.add(id));
    } catch (error) {
      console.log(`⚠️  Could not read ${filePath}: ${error.message}`);
    }
  });
  
  console.log('Found video IDs:');
  Array.from(allVideoIds).sort().forEach(id => {
    console.log(`  - ${id}`);
  });
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Step 2: Apply replacements
  console.log('🔄 Applying video replacements...');
  
  filesToUpdate.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const updatedContent = updateVideoIds(content, videoReplacements);
      
      if (content !== updatedContent) {
        fs.writeFileSync(filePath, updatedContent);
        console.log(`✅ Updated ${filePath}`);
      } else {
        console.log(`⏭️  No changes needed in ${filePath}`);
      }
    } catch (error) {
      console.log(`❌ Error updating ${filePath}: ${error.message}`);
    }
  });
  
  console.log('\n✅ Video replacements complete!');
  console.log('\n📝 MANUAL ADDITIONS NEEDED:');
  console.log('The following videos need to be manually added to specific locations:');
  console.log('- Script Mastery: 7dmw0gCQB84');
  console.log('- Prospecting Hub: dB9Y2fu_o6E');
  console.log('- SOI Step 1: KrLPc_ax_Ho');
  console.log('- Probate Step 1: elBK_YVWf88');
  console.log('- Investors Step 1: VOlm5MjE-0w');
  console.log('- FTHB Step 1: Djy-19IaxN4');
  console.log('- Divorce Step 1: F_z3UwL6RoU');
  console.log('- Pre-foreclosure Step 1: XVuxepAtR6M');
  console.log('- DISC Art of Connection: cK8BCZroyQI');
  console.log('- Portal Home (Empower AI only): ayPLCQ_TCU8');
  
  console.log('\nNext steps:');
  console.log('1. Manually add the new videos to their specific locations');
  console.log('2. Test the changes in your development server');
  console.log('3. Commit the changes to git');
}

if (require.main === module) {
  main();
}

module.exports = { findVideoIds, updateVideoIds };
