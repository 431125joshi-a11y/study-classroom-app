import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Building production web app...');
execSync('npm run build', { stdio: 'inherit' });

console.log('📦 Deploying dist/ directory to gh-pages branch on GitHub...');
const gitPath = 'C:\\Users\\Akash\\AppData\\Local\\Programs\\MinGit\\cmd\\git.exe';
const gitCmd = fs.existsSync(gitPath) ? `"${gitPath}"` : 'git';

try {
  // Push dist directly to gh-pages branch
  const tempBranch = `gh-pages-deploy-${Date.now()}`;
  execSync(`${gitCmd} checkout -b ${tempBranch}`, { stdio: 'inherit' });
  execSync(`${gitCmd} add -f dist`, { stdio: 'inherit' });
  execSync(`${gitCmd} commit -m "chore: release update"`, { stdio: 'inherit' });
  const subtreeId = execSync(`${gitCmd} subtree split --prefix dist -b ${tempBranch}-split`).toString().trim();
  execSync(`${gitCmd} push origin ${tempBranch}-split:gh-pages --force`, { stdio: 'inherit' });
  execSync(`${gitCmd} checkout main`, { stdio: 'inherit' });
  execSync(`${gitCmd} branch -D ${tempBranch}`, { stdio: 'inherit' });
  execSync(`${gitCmd} branch -D ${tempBranch}-split`, { stdio: 'inherit' });
  console.log('🎉 Successfully published to GitHub Pages: https://431125joshi-a11y.github.io/study-classroom-app/');
} catch (e) {
  console.error('Deployment finished with note:', e.message);
}
