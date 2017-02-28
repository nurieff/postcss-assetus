# postcss-assetus

Find the assets and then saves (or convert to inline) and compresses

Easy to use with your CSS

## Install
```
npm install postcss-assetus --save
```
## Example
```javascript
postcss([
    require('postcss-assetus')()
])
```
### Input example
```css
.image {
    background-image: assetus-url("assets/images/image.png");
    background-size: assetus-size("assets/images/image.png");
    width: assetus-width("assets/images/image.png");
    height: assetus-height("assets/images/image.png");
}
.image-inline {
    background-image: assetus-inline("assets/images/image.png");
    width: assetus-width("assets/images/image.png");
    height: assetus-height("assets/images/image.png");
}
/* .icon-... */
```
### Output example
```css
.image {
    background-image: url("../images/image.png");
    background-size: 60px 60px;
    width: 60px;
    height: 60px;
}

.image-inline {
    background-image: url(data:image/png;base64,...);
    width: 60px;
    height: 60px;
}
```

## Methods and options
The path relative to the root of the script
```scss
$image: "assets/images/image.png";
```

### Methods

Method | Description
------ | -----------
`assetus-url($image);` | is replaced by a relative link to the image `url("../images/icons.png")`
`assetus-size($image);` | is replaced with the size of the image
`assetus-height($image);` | is replaced by height in pixels
`assetus-width($image);` | is replaced by width in pixels
`assetus:ihw($image);` | is replaced by the image's url, height and width of the image `background-image: url("../images/image.png);height:30px;width:30px;`

### Inline options
```
$image: "assets/images/image.png?name=newimage";
```
- **name** — another name of the image to save


## Plugin options
```javascript
// ...
postcss([
  assetus({
    searchPrefix: "assetus",
    withImagemin: true,
    withImageminPlugins: [
        imageminPngquant({
           quality: "60-70",
           speed: 1
       })
    ],
    imageDirCSS: "../images/",
    imageDirSave: "public/images/"
  })
])
// ...
``` 
**withImagemin**

Compression of the image using [imagemin][]. Defaults to `true`

Images of `assetus-inline` are compressed too

***
**withImageminPlugins** 

Specify what to use plugins for. Defaults to `[require('imagemin-pngquant')({quality: "60-70",speed: 1})]`

***
**imageDirCSS**

Relative URL (background-image) which is replaced in position in your CSS. Defaults to `../images/`


***
**imageDirSave**

The path where to save the images relative to the root of the script. Defaults to `public/images/`

***
**searchPrefix**

If you want to use a different prefix, then this option is for you.
Defaults to `assetus`

*gulpfile.js*

```javascript
// ...
postcss([
  assetus({
    searchPrefix: "myprefix"
  })
])
// ...
```
Now you can now use

```css
.icon {
    background-image: myprefix-url(...);
    background-size: myprefix-size(...);
    myprefix:ihw(...);
}
```