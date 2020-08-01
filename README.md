# action-release-with-hemtt

This action builds your [HEMTT](https://github.com/synixebrett/HEMTT) mod and then zips it. You could then use that zip and attach it as an artifact or to a release.

## Inputs

### `zip_build`
This input is optional (Default: `true`)
Whether the build should be zipped.

## Outputs

### `release_path`
Relative path of released addon before it is zipped. (is equal to `./releases/<version>`)

### `zip_path`
Relative path of zipped mod. Will be not set if input `zip_build` is `false`

### `zip_name`
Name of packed mod (without file extension). Will be not set if input `zip_build` is `false`.

## Example usage

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

## License
The scripts and documentation in this project are released under the [MIT License](LICENSE)
