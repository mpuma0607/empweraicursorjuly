const fs = require('fs');
const path = require('path');

// Files that need to be updated from GPT-4o to GPT-5
const filesToUpdate = [
  'lib/actions.ts',
  'lib/script-generation-actions.ts',
  'lib/listing-description-actions.ts',
  'lib/realbio-actions.ts',
  'lib/content-generation-actions.ts',
  'app/ai-hub/dynamic-branded-content/actions.ts',
  'app/ai-hub/ideahub-empower/actions.ts',
  'app/ai-hub/ideahub-ai/actions.ts',
  'app/ai-hub/ideahub-beggins/actions.ts',
  'app/ai-hub/ideahub-v2/actions.ts',
  'app/ai-hub/realcoach-ai/actions.ts',
  'app/ai-hub/scriptit-ai/actions.ts',
  'app/ai-hub/listit-ai/actions.ts',
  'app/ai-hub/whos-who-ai/actions.ts',
  'app/ai-hub/propbot-ai/actions.ts',
  'app/api/generate-property-script/route.ts'
];

// Files that need to be updated from GPT-4 to GPT-5
const filesToUpdateFromGpt4 = [
  'app/api/analyze-contract/route.ts',
  'app/api/realdeal/analyze/route.ts',
  'app/ai-hub/mymarket-ai/actions.ts'
];

console.log('🚀 Upgrading AI tools to GPT-5...\n');

// Update GPT-4o to GPT-5
filesToUpdate.forEach(filePath => {
  try {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      
      // Replace gpt-4o with gpt-5
      content = content.replace(/gpt-4o/g, 'gpt-5');
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated: ${filePath}`);
      } else {
        console.log(`⏭️  No changes needed: ${filePath}`);
      }
    } else {
      console.log(`❌ File not found: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
});

console.log('\n🔄 Upgrading GPT-4 to GPT-5...\n');

// Update GPT-4 to GPT-5
filesToUpdateFromGpt4.forEach(filePath => {
  try {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      
      // Replace "gpt-4" with "gpt-5"
      content = content.replace(/"gpt-4"/g, '"gpt-5"');
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated: ${filePath}`);
      } else {
        console.log(`⏭️  No changes needed: ${filePath}`);
      }
    } else {
      console.log(`❌ File not found: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
});

console.log('\n🎉 GPT-5 upgrade complete! All AI tools now use the latest model.');
