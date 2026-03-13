#!/usr/bin/env node

const { program } = require('commander');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

program
  .name('add-skill')
  .description('Install Ant Design Claude Skill to your project')
  .version('0.1.0')
  .action(async () => {
    console.log(chalk.blue.bold('\n🚀 Ant Design Claude Skill Installer\n'));

    // Define possible paths
    const possiblePaths = {
      project: path.join(process.cwd(), '.claude', 'skills'),
      global: path.join(process.env.HOME || process.env.USERPROFILE, '.claude', 'skills'),
    };

    // Always ask user for location preference
    const { location } = await inquirer.prompt([
      {
        type: 'list',
        name: 'location',
        message: 'Where would you like to install the skill?',
        choices: [
          { name: 'Current project (./.claude/skills)', value: 'project' },
          { name: 'Global Claude directory (~/.claude/skills)', value: 'global' },
          { name: 'Custom location', value: 'custom' },
        ],
      },
    ]);

    let targetDir = null;

    if (location === 'custom') {
      // Ask for custom path
      const { customPath } = await inquirer.prompt([
        {
          type: 'input',
          name: 'customPath',
          message: 'Enter the custom path:',
          validate: (input) => input.trim() !== '' || 'Path cannot be empty',
        },
      ]);
      targetDir = path.resolve(customPath);
    } else {
      // Use predefined path
      targetDir = possiblePaths[location];
    }

    const skillTargetDir = path.join(targetDir, 'pro-components-page');

    // Check if skill already exists
    if (fs.existsSync(skillTargetDir)) {
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: chalk.yellow('Skill already exists. Overwrite?'),
          default: false,
        },
      ]);

      if (!overwrite) {
        console.log(chalk.yellow('\n❌ Installation cancelled.\n'));
        process.exit(0);
      }
    }

    // Create target directory and install
    try {
      // Create parent directory if it doesn't exist
      if (!fs.existsSync(targetDir)) {
        console.log(chalk.gray(`Creating directory: ${targetDir}`));
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // Create skill directory
      fs.mkdirSync(skillTargetDir, { recursive: true });

      // Get source directory
      const packageDir = path.join(__dirname, '..');
      const sourceDir = path.join(packageDir, 'skills', 'antd-claude-skill');

      if (!fs.existsSync(sourceDir)) {
        console.log(chalk.red('\n❌ Error: Skill source files not found.\n'));
        process.exit(1);
      }

      // Copy skill files
      console.log(chalk.gray('\nCopying files...'));
      copyDirectory(sourceDir, skillTargetDir);

      console.log(chalk.green('\n✅ Skill installed successfully!\n'));
      console.log(chalk.cyan('📁 Location:'), skillTargetDir);
      console.log(chalk.cyan('\n📖 Usage:'));
      console.log('   The skill will be automatically available in Claude Code.');
      console.log('   Trigger it by mentioning: "create a table page" or "create a form page"\n');

    } catch (error) {
      console.log(chalk.red('\n❌ Error installing skill:'), error.message, '\n');
      process.exit(1);
    }
  });

// Helper function to copy directory recursively
function copyDirectory(src, dest) {
  // Create destination directory
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read source directory
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // Recursively copy subdirectory
      copyDirectory(srcPath, destPath);
    } else {
      // Copy file
      fs.copyFileSync(srcPath, destPath);
      console.log(chalk.gray('  ✓'), entry.name);
    }
  }
}

program.parse();
