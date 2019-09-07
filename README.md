# action-release-with-hemtt

This builds your [HEMTT](https://github.com/synixebrett/HEMTT/commits/master) mod and then zips it. You can then use that zip and attach it as an artifact or to a release.

# Usage

See [action.yml](action.yml)

Basic:
```yaml
steps:
- uses: actions/checkout@master

- uses: gruppe-adler/action-release-with-hemtt@master
  id: build

- run: echo 'Release ${{ steps.build.outputs.zip_name }} is ready.'

- uses: actions/upload-artifact@master
  with:
    name: 'packed-mod'
    path: ${{ steps.build.outputs.zip_path }}
```

# License
The scripts and documentation in this project are released under the [MIT License](LICENSE)
