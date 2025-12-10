const semver = require('semver');
const fs = require('fs/promises');
const path = require('path');

async function updatePackageVersion() {
  try {
    const pkgPaths = process.argv.slice(2);
    if (pkgPaths.length === 0) {
      console.error(
        'Usage: node bump-version.js <package-path> [package-path...]'
      );
      process.exit(1);
    }

    const gitRef = process.env.GIT_REFNAME;
    const gitTag = semver.valid(gitRef);
    if (!gitTag) {
      console.log('No valid git tag found, skipping version bump');
      return;
    }

    for (const pkgPath of pkgPaths) {
      const pkgJsonPath = path.join(process.cwd(), pkgPath, 'package.json');

      try {
        await fs.access(pkgJsonPath);
      } catch {
        console.error(`Package not found: ${pkgJsonPath}`);
        continue;
      }

      const pkg = JSON.parse(await fs.readFile(pkgJsonPath, 'utf-8'));

      if (semver.compare(gitTag, pkg.version) > 0) {
        pkg.version = gitTag;
        console.log(`Bumped ${pkgPath} version to ${gitTag}`);
        await fs.writeFile(pkgJsonPath, JSON.stringify(pkg, null, 2));
      }
    }
  } catch (err) {
    console.error('Update Package Version error: ', err);
  }
}

updatePackageVersion();
