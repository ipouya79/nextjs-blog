(function() {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./node_modules/next/dist/client/image.js":
/*!************************************************!*\
  !*** ./node_modules/next/dist/client/image.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/next/node_modules/@babel/runtime/helpers/interopRequireDefault.js");

exports.__esModule = true;
exports.default = Image;

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/objectWithoutPropertiesLoose */ "./node_modules/next/node_modules/@babel/runtime/helpers/objectWithoutPropertiesLoose.js"));

var _extends2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/next/node_modules/@babel/runtime/helpers/extends.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));

var _head = _interopRequireDefault(__webpack_require__(/*! ../next-server/lib/head */ "../next-server/lib/head"));

var _toBase = __webpack_require__(/*! ../next-server/lib/to-base-64 */ "../next-server/lib/to-base-64");

var _imageConfig = __webpack_require__(/*! ../next-server/server/image-config */ "../next-server/server/image-config");

var _useIntersection = __webpack_require__(/*! ./use-intersection */ "./node_modules/next/dist/client/use-intersection.js");

if (true) {
  ;
  global.__NEXT_IMAGE_IMPORTED = true;
}

const VALID_LOADING_VALUES = ['lazy', 'eager', undefined];
const loaders = new Map([['imgix', imgixLoader], ['cloudinary', cloudinaryLoader], ['akamai', akamaiLoader], ['default', defaultLoader]]);
const VALID_LAYOUT_VALUES = ['fill', 'fixed', 'intrinsic', 'responsive', undefined];

function isStaticRequire(src) {
  return src.default !== undefined;
}

function isStaticImageData(src) {
  return src.src !== undefined;
}

function isStaticImport(src) {
  return typeof src === 'object' && (isStaticRequire(src) || isStaticImageData(src));
}

const {
  deviceSizes: configDeviceSizes,
  imageSizes: configImageSizes,
  loader: configLoader,
  path: configPath,
  domains: configDomains
} = {"deviceSizes":[640,750,828,1080,1200,1920,2048,3840],"imageSizes":[16,32,48,64,96,128,256,384],"path":"/_next/image","loader":"default","domains":[]} || _imageConfig.imageConfigDefault; // sort smallest to largest

const allSizes = [...configDeviceSizes, ...configImageSizes];
configDeviceSizes.sort((a, b) => a - b);
allSizes.sort((a, b) => a - b);

function getWidths(width, layout, sizes) {
  if (sizes && (layout === 'fill' || layout === 'responsive')) {
    // Find all the "vw" percent sizes used in the sizes prop
    const viewportWidthRe = /(^|\s)(1?\d?\d)vw/g;
    const percentSizes = [];

    for (let match; match = viewportWidthRe.exec(sizes); match) {
      percentSizes.push(parseInt(match[2]));
    }

    if (percentSizes.length) {
      const smallestRatio = Math.min(...percentSizes) * 0.01;
      return {
        widths: allSizes.filter(s => s >= configDeviceSizes[0] * smallestRatio),
        kind: 'w'
      };
    }

    return {
      widths: allSizes,
      kind: 'w'
    };
  }

  if (typeof width !== 'number' || layout === 'fill' || layout === 'responsive') {
    return {
      widths: configDeviceSizes,
      kind: 'w'
    };
  }

  const widths = [...new Set( // > This means that most OLED screens that say they are 3x resolution,
  // > are actually 3x in the green color, but only 1.5x in the red and
  // > blue colors. Showing a 3x resolution image in the app vs a 2x
  // > resolution image will be visually the same, though the 3x image
  // > takes significantly more data. Even true 3x resolution screens are
  // > wasteful as the human eye cannot see that level of detail without
  // > something like a magnifying glass.
  // https://blog.twitter.com/engineering/en_us/topics/infrastructure/2019/capping-image-fidelity-on-ultra-high-resolution-devices.html
  [width, width * 2
  /*, width * 3*/
  ].map(w => allSizes.find(p => p >= w) || allSizes[allSizes.length - 1]))];
  return {
    widths,
    kind: 'x'
  };
}

function generateImgAttrs({
  src,
  unoptimized,
  layout,
  width,
  quality,
  sizes,
  loader
}) {
  if (unoptimized) {
    return {
      src,
      srcSet: undefined,
      sizes: undefined
    };
  }

  const {
    widths,
    kind
  } = getWidths(width, layout, sizes);
  const last = widths.length - 1;
  return {
    sizes: !sizes && kind === 'w' ? '100vw' : sizes,
    srcSet: widths.map((w, i) => `${loader({
      src,
      quality,
      width: w
    })} ${kind === 'w' ? w : i + 1}${kind}`).join(', '),
    // It's intended to keep `src` the last attribute because React updates
    // attributes in order. If we keep `src` the first one, Safari will
    // immediately start to fetch `src`, before `sizes` and `srcSet` are even
    // updated by React. That causes multiple unnecessary requests if `srcSet`
    // and `sizes` are defined.
    // This bug cannot be reproduced in Chrome or Firefox.
    src: loader({
      src,
      quality,
      width: widths[last]
    })
  };
}

function getInt(x) {
  if (typeof x === 'number') {
    return x;
  }

  if (typeof x === 'string') {
    return parseInt(x, 10);
  }

  return undefined;
}

function defaultImageLoader(loaderProps) {
  const load = loaders.get(configLoader);

  if (load) {
    return load((0, _extends2.default)({
      root: configPath
    }, loaderProps));
  }

  throw new Error(`Unknown "loader" found in "next.config.js". Expected: ${_imageConfig.VALID_LOADERS.join(', ')}. Received: ${configLoader}`);
} // See https://stackoverflow.com/q/39777833/266535 for why we use this ref
// handler instead of the img's onLoad attribute.


function removePlaceholder(img, placeholder) {
  if (placeholder === 'blur' && img) {
    const handleLoad = () => {
      if (!img.src.startsWith('data:')) {
        const p = 'decode' in img ? img.decode() : Promise.resolve();
        p.catch(() => {}).then(() => {
          img.style.filter = 'none';
          img.style.backgroundSize = 'none';
          img.style.backgroundImage = 'none';
        });
      }
    };

    if (img.complete) {
      // If the real image fails to load, this will still remove the placeholder.
      // This is the desired behavior for now, and will be revisited when error
      // handling is worked on for the image component itself.
      handleLoad();
    } else {
      img.onload = handleLoad;
    }
  }
}

function Image(_ref) {
  let {
    src,
    sizes,
    unoptimized = false,
    priority = false,
    loading,
    className,
    quality,
    width,
    height,
    objectFit,
    objectPosition,
    loader = defaultImageLoader,
    placeholder = 'empty',
    blurDataURL
  } = _ref,
      all = (0, _objectWithoutPropertiesLoose2.default)(_ref, ["src", "sizes", "unoptimized", "priority", "loading", "className", "quality", "width", "height", "objectFit", "objectPosition", "loader", "placeholder", "blurDataURL"]);
  let rest = all;
  let layout = sizes ? 'responsive' : 'intrinsic';

  if ('layout' in rest) {
    // Override default layout if the user specified one:
    if (rest.layout) layout = rest.layout; // Remove property so it's not spread into image:

    delete rest['layout'];
  }

  let staticSrc = '';

  if (isStaticImport(src)) {
    const staticImageData = isStaticRequire(src) ? src.default : src;

    if (!staticImageData.src) {
      throw new Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ${JSON.stringify(staticImageData)}`);
    }

    blurDataURL = blurDataURL || staticImageData.blurDataURL;
    staticSrc = staticImageData.src;

    if (!layout || layout !== 'fill') {
      height = height || staticImageData.height;
      width = width || staticImageData.width;

      if (!staticImageData.height || !staticImageData.width) {
        throw new Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ${JSON.stringify(staticImageData)}`);
      }
    }
  }

  src = typeof src === 'string' ? src : staticSrc;
  const widthInt = getInt(width);
  const heightInt = getInt(height);
  const qualityInt = getInt(quality);

  if (true) {
    if (!src) {
      throw new Error(`Image is missing required "src" property. Make sure you pass "src" in props to the \`next/image\` component. Received: ${JSON.stringify({
        width,
        height,
        quality
      })}`);
    }

    if (!VALID_LAYOUT_VALUES.includes(layout)) {
      throw new Error(`Image with src "${src}" has invalid "layout" property. Provided "${layout}" should be one of ${VALID_LAYOUT_VALUES.map(String).join(',')}.`);
    }

    if (typeof widthInt !== 'undefined' && isNaN(widthInt) || typeof heightInt !== 'undefined' && isNaN(heightInt)) {
      throw new Error(`Image with src "${src}" has invalid "width" or "height" property. These should be numeric values.`);
    }

    if (!VALID_LOADING_VALUES.includes(loading)) {
      throw new Error(`Image with src "${src}" has invalid "loading" property. Provided "${loading}" should be one of ${VALID_LOADING_VALUES.map(String).join(',')}.`);
    }

    if (priority && loading === 'lazy') {
      throw new Error(`Image with src "${src}" has both "priority" and "loading='lazy'" properties. Only one should be used.`);
    }

    if (placeholder === 'blur') {
      if (layout !== 'fill' && (widthInt || 0) * (heightInt || 0) < 1600) {
        console.warn(`Image with src "${src}" is smaller than 40x40. Consider removing the "placeholder='blur'" property to improve performance.`);
      }

      if (!blurDataURL) {
        const VALID_BLUR_EXT = ['jpeg', 'png', 'webp']; // should match next-image-loader

        throw new Error(`Image with src "${src}" has "placeholder='blur'" property but is missing the "blurDataURL" property.
          Possible solutions:
            - Add a "blurDataURL" property, the contents should be a small Data URL to represent the image
            - Change the "src" property to a static import with one of the supported file types: ${VALID_BLUR_EXT.join(',')}
            - Remove the "placeholder" property, effectively no blur effect
          Read more: https://nextjs.org/docs/messages/placeholder-blur-data-url`);
      }
    }
  }

  let isLazy = !priority && (loading === 'lazy' || typeof loading === 'undefined');

  if (src && src.startsWith('data:')) {
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
    unoptimized = true;
    isLazy = false;
  }

  const [setRef, isIntersected] = (0, _useIntersection.useIntersection)({
    rootMargin: '200px',
    disabled: !isLazy
  });
  const isVisible = !isLazy || isIntersected;
  let wrapperStyle;
  let sizerStyle;
  let sizerSvg;
  let imgStyle = (0, _extends2.default)({
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    boxSizing: 'border-box',
    padding: 0,
    border: 'none',
    margin: 'auto',
    display: 'block',
    width: 0,
    height: 0,
    minWidth: '100%',
    maxWidth: '100%',
    minHeight: '100%',
    maxHeight: '100%',
    objectFit,
    objectPosition
  }, placeholder === 'blur' ? {
    filter: 'blur(20px)',
    backgroundSize: 'cover',
    backgroundImage: `url("${blurDataURL}")`
  } : undefined);

  if (typeof widthInt !== 'undefined' && typeof heightInt !== 'undefined' && layout !== 'fill') {
    // <Image src="i.png" width="100" height="100" />
    const quotient = heightInt / widthInt;
    const paddingTop = isNaN(quotient) ? '100%' : `${quotient * 100}%`;

    if (layout === 'responsive') {
      // <Image src="i.png" width="100" height="100" layout="responsive" />
      wrapperStyle = {
        display: 'block',
        overflow: 'hidden',
        position: 'relative',
        boxSizing: 'border-box',
        margin: 0
      };
      sizerStyle = {
        display: 'block',
        boxSizing: 'border-box',
        paddingTop
      };
    } else if (layout === 'intrinsic') {
      // <Image src="i.png" width="100" height="100" layout="intrinsic" />
      wrapperStyle = {
        display: 'inline-block',
        maxWidth: '100%',
        overflow: 'hidden',
        position: 'relative',
        boxSizing: 'border-box',
        margin: 0
      };
      sizerStyle = {
        boxSizing: 'border-box',
        display: 'block',
        maxWidth: '100%'
      };
      sizerSvg = `<svg width="${widthInt}" height="${heightInt}" xmlns="http://www.w3.org/2000/svg" version="1.1"/>`;
    } else if (layout === 'fixed') {
      // <Image src="i.png" width="100" height="100" layout="fixed" />
      wrapperStyle = {
        overflow: 'hidden',
        boxSizing: 'border-box',
        display: 'inline-block',
        position: 'relative',
        width: widthInt,
        height: heightInt
      };
    }
  } else if (typeof widthInt === 'undefined' && typeof heightInt === 'undefined' && layout === 'fill') {
    // <Image src="i.png" layout="fill" />
    wrapperStyle = {
      display: 'block',
      overflow: 'hidden',
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      boxSizing: 'border-box',
      margin: 0
    };
  } else {
    // <Image src="i.png" />
    if (true) {
      throw new Error(`Image with src "${src}" must use "width" and "height" properties or "layout='fill'" property.`);
    }
  }

  let imgAttributes = {
    src: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    srcSet: undefined,
    sizes: undefined
  };

  if (isVisible) {
    imgAttributes = generateImgAttrs({
      src,
      unoptimized,
      layout,
      width: widthInt,
      quality: qualityInt,
      sizes,
      loader
    });
  }

  return /*#__PURE__*/_react.default.createElement("div", {
    style: wrapperStyle
  }, sizerStyle ? /*#__PURE__*/_react.default.createElement("div", {
    style: sizerStyle
  }, sizerSvg ? /*#__PURE__*/_react.default.createElement("img", {
    style: {
      maxWidth: '100%',
      display: 'block',
      margin: 0,
      border: 'none',
      padding: 0
    },
    alt: "",
    "aria-hidden": true,
    role: "presentation",
    src: `data:image/svg+xml;base64,${(0, _toBase.toBase64)(sizerSvg)}`
  }) : null) : null, !isVisible && /*#__PURE__*/_react.default.createElement("noscript", null, /*#__PURE__*/_react.default.createElement("img", Object.assign({}, rest, generateImgAttrs({
    src,
    unoptimized,
    layout,
    width: widthInt,
    quality: qualityInt,
    sizes,
    loader
  }), {
    decoding: "async",
    style: imgStyle,
    className: className
  }))), /*#__PURE__*/_react.default.createElement("img", Object.assign({}, rest, imgAttributes, {
    decoding: "async",
    className: className,
    ref: element => {
      setRef(element);
      removePlaceholder(element, placeholder);
    },
    style: imgStyle
  })), priority ?
  /*#__PURE__*/
  // Note how we omit the `href` attribute, as it would only be relevant
  // for browsers that do not support `imagesrcset`, and in those cases
  // it would likely cause the incorrect image to be preloaded.
  //
  // https://html.spec.whatwg.org/multipage/semantics.html#attr-link-imagesrcset
  _react.default.createElement(_head.default, null, /*#__PURE__*/_react.default.createElement("link", {
    key: '__nimg-' + imgAttributes.src + imgAttributes.srcSet + imgAttributes.sizes,
    rel: "preload",
    as: "image",
    href: imgAttributes.srcSet ? undefined : imgAttributes.src // @ts-ignore: imagesrcset is not yet in the link element type
    ,
    imagesrcset: imgAttributes.srcSet // @ts-ignore: imagesizes is not yet in the link element type
    ,
    imagesizes: imgAttributes.sizes
  })) : null);
} //BUILT IN LOADERS


function normalizeSrc(src) {
  return src[0] === '/' ? src.slice(1) : src;
}

function imgixLoader({
  root,
  src,
  width,
  quality
}) {
  // Demo: https://static.imgix.net/daisy.png?format=auto&fit=max&w=300
  const params = ['auto=format', 'fit=max', 'w=' + width];
  let paramsString = '';

  if (quality) {
    params.push('q=' + quality);
  }

  if (params.length) {
    paramsString = '?' + params.join('&');
  }

  return `${root}${normalizeSrc(src)}${paramsString}`;
}

function akamaiLoader({
  root,
  src,
  width
}) {
  return `${root}${normalizeSrc(src)}?imwidth=${width}`;
}

function cloudinaryLoader({
  root,
  src,
  width,
  quality
}) {
  // Demo: https://res.cloudinary.com/demo/image/upload/w_300,c_limit,q_auto/turtles.jpg
  const params = ['f_auto', 'c_limit', 'w_' + width, 'q_' + (quality || 'auto')];
  let paramsString = params.join(',') + '/';
  return `${root}${paramsString}${normalizeSrc(src)}`;
}

function defaultLoader({
  root,
  src,
  width,
  quality
}) {
  if (true) {
    const missingValues = []; // these should always be provided but make sure they are

    if (!src) missingValues.push('src');
    if (!width) missingValues.push('width');

    if (missingValues.length > 0) {
      throw new Error(`Next Image Optimization requires ${missingValues.join(', ')} to be provided. Make sure you pass them as props to the \`next/image\` component. Received: ${JSON.stringify({
        src,
        width,
        quality
      })}`);
    }

    if (src.startsWith('//')) {
      throw new Error(`Failed to parse src "${src}" on \`next/image\`, protocol-relative URL (//) must be changed to an absolute URL (http:// or https://)`);
    }

    if (!src.startsWith('/') && configDomains) {
      let parsedSrc;

      try {
        parsedSrc = new URL(src);
      } catch (err) {
        console.error(err);
        throw new Error(`Failed to parse src "${src}" on \`next/image\`, if using relative image it must start with a leading slash "/" or be an absolute URL (http:// or https://)`);
      }

      if (!configDomains.includes(parsedSrc.hostname)) {
        throw new Error(`Invalid src prop (${src}) on \`next/image\`, hostname "${parsedSrc.hostname}" is not configured under images in your \`next.config.js\`\n` + `See more info: https://nextjs.org/docs/messages/next-image-unconfigured-host`);
      }
    }
  }

  return `${root}?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
}

/***/ }),

/***/ "./node_modules/next/dist/client/link.js":
/*!***********************************************!*\
  !*** ./node_modules/next/dist/client/link.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var _interopRequireWildcard = __webpack_require__(/*! @babel/runtime/helpers/interopRequireWildcard */ "./node_modules/next/node_modules/@babel/runtime/helpers/interopRequireWildcard.js");

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));

var _router = __webpack_require__(/*! ../next-server/lib/router/router */ "./node_modules/next/dist/next-server/lib/router/router.js");

var _router2 = __webpack_require__(/*! ./router */ "./node_modules/next/dist/client/router.js");

var _useIntersection = __webpack_require__(/*! ./use-intersection */ "./node_modules/next/dist/client/use-intersection.js");

const prefetched = {};

function prefetch(router, href, as, options) {
  if (true) return;
  if (!(0, _router.isLocalURL)(href)) return; // Prefetch the JSON page if asked (only in the client)
  // We need to handle a prefetch error here since we may be
  // loading with priority which can reject but we don't
  // want to force navigation since this is only a prefetch

  router.prefetch(href, as, options).catch(err => {
    if (true) {
      // rethrow to show invalid URL errors
      throw err;
    }
  });
  const curLocale = options && typeof options.locale !== 'undefined' ? options.locale : router && router.locale; // Join on an invalid URI character

  prefetched[href + '%' + as + (curLocale ? '%' + curLocale : '')] = true;
}

function isModifiedEvent(event) {
  const {
    target
  } = event.currentTarget;
  return target && target !== '_self' || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || // triggers resource download
  event.nativeEvent && event.nativeEvent.which === 2;
}

function linkClicked(e, router, href, as, replace, shallow, scroll, locale) {
  const {
    nodeName
  } = e.currentTarget;

  if (nodeName === 'A' && (isModifiedEvent(e) || !(0, _router.isLocalURL)(href))) {
    // ignore click for browser’s default behavior
    return;
  }

  e.preventDefault(); //  avoid scroll for urls with anchor refs

  if (scroll == null && as.indexOf('#') >= 0) {
    scroll = false;
  } // replace state instead of push if prop is present


  router[replace ? 'replace' : 'push'](href, as, {
    shallow,
    locale,
    scroll
  });
}

function Link(props) {
  if (true) {
    function createPropError(args) {
      return new Error(`Failed prop type: The prop \`${args.key}\` expects a ${args.expected} in \`<Link>\`, but got \`${args.actual}\` instead.` + ( false ? 0 : ''));
    } // TypeScript trick for type-guarding:


    const requiredPropsGuard = {
      href: true
    };
    const requiredProps = Object.keys(requiredPropsGuard);
    requiredProps.forEach(key => {
      if (key === 'href') {
        if (props[key] == null || typeof props[key] !== 'string' && typeof props[key] !== 'object') {
          throw createPropError({
            key,
            expected: '`string` or `object`',
            actual: props[key] === null ? 'null' : typeof props[key]
          });
        }
      } else {
        // TypeScript trick for type-guarding:
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _ = key;
      }
    }); // TypeScript trick for type-guarding:

    const optionalPropsGuard = {
      as: true,
      replace: true,
      scroll: true,
      shallow: true,
      passHref: true,
      prefetch: true,
      locale: true
    };
    const optionalProps = Object.keys(optionalPropsGuard);
    optionalProps.forEach(key => {
      const valType = typeof props[key];

      if (key === 'as') {
        if (props[key] && valType !== 'string' && valType !== 'object') {
          throw createPropError({
            key,
            expected: '`string` or `object`',
            actual: valType
          });
        }
      } else if (key === 'locale') {
        if (props[key] && valType !== 'string') {
          throw createPropError({
            key,
            expected: '`string`',
            actual: valType
          });
        }
      } else if (key === 'replace' || key === 'scroll' || key === 'shallow' || key === 'passHref' || key === 'prefetch') {
        if (props[key] != null && valType !== 'boolean') {
          throw createPropError({
            key,
            expected: '`boolean`',
            actual: valType
          });
        }
      } else {
        // TypeScript trick for type-guarding:
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _ = key;
      }
    }); // This hook is in a conditional but that is ok because `process.env.NODE_ENV` never changes
    // eslint-disable-next-line react-hooks/rules-of-hooks

    const hasWarned = _react.default.useRef(false);

    if (props.prefetch && !hasWarned.current) {
      hasWarned.current = true;
      console.warn('Next.js auto-prefetches automatically based on viewport. The prefetch attribute is no longer needed. More: https://nextjs.org/docs/messages/prefetch-true-deprecated');
    }
  }

  const p = props.prefetch !== false;
  const router = (0, _router2.useRouter)();

  const {
    href,
    as
  } = _react.default.useMemo(() => {
    const [resolvedHref, resolvedAs] = (0, _router.resolveHref)(router, props.href, true);
    return {
      href: resolvedHref,
      as: props.as ? (0, _router.resolveHref)(router, props.as) : resolvedAs || resolvedHref
    };
  }, [router, props.href, props.as]);

  let {
    children,
    replace,
    shallow,
    scroll,
    locale
  } = props; // Deprecated. Warning shown by propType check. If the children provided is a string (<Link>example</Link>) we wrap it in an <a> tag

  if (typeof children === 'string') {
    children = /*#__PURE__*/_react.default.createElement("a", null, children);
  } // This will return the first child, if multiple are provided it will throw an error


  let child;

  if (true) {
    try {
      child = _react.Children.only(children);
    } catch (err) {
      throw new Error(`Multiple children were passed to <Link> with \`href\` of \`${props.href}\` but only one child is supported https://nextjs.org/docs/messages/link-multiple-children` + ( false ? 0 : ''));
    }
  } else {}

  const childRef = child && typeof child === 'object' && child.ref;
  const [setIntersectionRef, isVisible] = (0, _useIntersection.useIntersection)({
    rootMargin: '200px'
  });

  const setRef = _react.default.useCallback(el => {
    setIntersectionRef(el);

    if (childRef) {
      if (typeof childRef === 'function') childRef(el);else if (typeof childRef === 'object') {
        childRef.current = el;
      }
    }
  }, [childRef, setIntersectionRef]);

  (0, _react.useEffect)(() => {
    const shouldPrefetch = isVisible && p && (0, _router.isLocalURL)(href);
    const curLocale = typeof locale !== 'undefined' ? locale : router && router.locale;
    const isPrefetched = prefetched[href + '%' + as + (curLocale ? '%' + curLocale : '')];

    if (shouldPrefetch && !isPrefetched) {
      prefetch(router, href, as, {
        locale: curLocale
      });
    }
  }, [as, href, isVisible, locale, p, router]);
  const childProps = {
    ref: setRef,
    onClick: e => {
      if (child.props && typeof child.props.onClick === 'function') {
        child.props.onClick(e);
      }

      if (!e.defaultPrevented) {
        linkClicked(e, router, href, as, replace, shallow, scroll, locale);
      }
    }
  };

  childProps.onMouseEnter = e => {
    if (!(0, _router.isLocalURL)(href)) return;

    if (child.props && typeof child.props.onMouseEnter === 'function') {
      child.props.onMouseEnter(e);
    }

    prefetch(router, href, as, {
      priority: true
    });
  }; // If child is an <a> tag and doesn't have a href attribute, or if the 'passHref' property is
  // defined, we specify the current 'href', so that repetition is not needed by the user


  if (props.passHref || child.type === 'a' && !('href' in child.props)) {
    const curLocale = typeof locale !== 'undefined' ? locale : router && router.locale; // we only render domain locales if we are currently on a domain locale
    // so that locale links are still visitable in development/preview envs

    const localeDomain = router && router.isLocaleDomain && (0, _router.getDomainLocale)(as, curLocale, router && router.locales, router && router.domainLocales);
    childProps.href = localeDomain || (0, _router.addBasePath)((0, _router.addLocale)(as, curLocale, router && router.defaultLocale));
  }

  return /*#__PURE__*/_react.default.cloneElement(child, childProps);
}

var _default = Link;
exports.default = _default;

/***/ }),

/***/ "./node_modules/next/dist/client/normalize-trailing-slash.js":
/*!*******************************************************************!*\
  !*** ./node_modules/next/dist/client/normalize-trailing-slash.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


exports.__esModule = true;
exports.removePathTrailingSlash = removePathTrailingSlash;
exports.normalizePathTrailingSlash = void 0;
/**
* Removes the trailing slash of a path if there is one. Preserves the root path `/`.
*/

function removePathTrailingSlash(path) {
  return path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
}
/**
* Normalizes the trailing slash of a path according to the `trailingSlash` option
* in `next.config.js`.
*/


const normalizePathTrailingSlash =  false ? 0 : removePathTrailingSlash;
exports.normalizePathTrailingSlash = normalizePathTrailingSlash;

/***/ }),

/***/ "./node_modules/next/dist/client/request-idle-callback.js":
/*!****************************************************************!*\
  !*** ./node_modules/next/dist/client/request-idle-callback.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


exports.__esModule = true;
exports.cancelIdleCallback = exports.requestIdleCallback = void 0;

const requestIdleCallback = typeof self !== 'undefined' && self.requestIdleCallback || function (cb) {
  let start = Date.now();
  return setTimeout(function () {
    cb({
      didTimeout: false,
      timeRemaining: function () {
        return Math.max(0, 50 - (Date.now() - start));
      }
    });
  }, 1);
};

exports.requestIdleCallback = requestIdleCallback;

const cancelIdleCallback = typeof self !== 'undefined' && self.cancelIdleCallback || function (id) {
  return clearTimeout(id);
};

exports.cancelIdleCallback = cancelIdleCallback;

/***/ }),

/***/ "./node_modules/next/dist/client/route-loader.js":
/*!*******************************************************!*\
  !*** ./node_modules/next/dist/client/route-loader.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/next/node_modules/@babel/runtime/helpers/interopRequireDefault.js");

exports.__esModule = true;
exports.markAssetError = markAssetError;
exports.isAssetError = isAssetError;
exports.getClientBuildManifest = getClientBuildManifest;
exports.default = void 0;

var _getAssetPathFromRoute = _interopRequireDefault(__webpack_require__(/*! ../next-server/lib/router/utils/get-asset-path-from-route */ "../next-server/lib/router/utils/get-asset-path-from-route"));

var _requestIdleCallback = __webpack_require__(/*! ./request-idle-callback */ "./node_modules/next/dist/client/request-idle-callback.js"); // 3.8s was arbitrarily chosen as it's what https://web.dev/interactive
// considers as "Good" time-to-interactive. We must assume something went
// wrong beyond this point, and then fall-back to a full page transition to
// show the user something of value.


const MS_MAX_IDLE_DELAY = 3800;

function withFuture(key, map, generator) {
  let entry = map.get(key);

  if (entry) {
    if ('future' in entry) {
      return entry.future;
    }

    return Promise.resolve(entry);
  }

  let resolver;
  const prom = new Promise(resolve => {
    resolver = resolve;
  });
  map.set(key, entry = {
    resolve: resolver,
    future: prom
  });
  return generator ? // eslint-disable-next-line no-sequences
  generator().then(value => (resolver(value), value)) : prom;
}

function hasPrefetch(link) {
  try {
    link = document.createElement('link');
    return (// detect IE11 since it supports prefetch but isn't detected
      // with relList.support
      !!window.MSInputMethodContext && !!document.documentMode || link.relList.supports('prefetch')
    );
  } catch (_unused) {
    return false;
  }
}

const canPrefetch = hasPrefetch();

function prefetchViaDom(href, as, link) {
  return new Promise((res, rej) => {
    if (document.querySelector(`link[rel="prefetch"][href^="${href}"]`)) {
      return res();
    }

    link = document.createElement('link'); // The order of property assignment here is intentional:

    if (as) link.as = as;
    link.rel = `prefetch`;
    link.crossOrigin = undefined;
    link.onload = res;
    link.onerror = rej; // `href` should always be last:

    link.href = href;
    document.head.appendChild(link);
  });
}

const ASSET_LOAD_ERROR = Symbol('ASSET_LOAD_ERROR'); // TODO: unexport

function markAssetError(err) {
  return Object.defineProperty(err, ASSET_LOAD_ERROR, {});
}

function isAssetError(err) {
  return err && ASSET_LOAD_ERROR in err;
}

function appendScript(src, script) {
  return new Promise((resolve, reject) => {
    script = document.createElement('script'); // The order of property assignment here is intentional.
    // 1. Setup success/failure hooks in case the browser synchronously
    //    executes when `src` is set.

    script.onload = resolve;

    script.onerror = () => reject(markAssetError(new Error(`Failed to load script: ${src}`))); // 2. Configure the cross-origin attribute before setting `src` in case the
    //    browser begins to fetch.


    script.crossOrigin = undefined; // 3. Finally, set the source and inject into the DOM in case the child
    //    must be appended for fetching to start.

    script.src = src;
    document.body.appendChild(script);
  });
} // Resolve a promise that times out after given amount of milliseconds.


function resolvePromiseWithTimeout(p, ms, err) {
  return new Promise((resolve, reject) => {
    let cancelled = false;
    p.then(r => {
      // Resolved, cancel the timeout
      cancelled = true;
      resolve(r);
    }).catch(reject);
    (0, _requestIdleCallback.requestIdleCallback)(() => setTimeout(() => {
      if (!cancelled) {
        reject(err);
      }
    }, ms));
  });
} // TODO: stop exporting or cache the failure
// It'd be best to stop exporting this. It's an implementation detail. We're
// only exporting it for backwards compatibilty with the `page-loader`.
// Only cache this response as a last resort if we cannot eliminate all other
// code branches that use the Build Manifest Callback and push them through
// the Route Loader interface.


function getClientBuildManifest() {
  if (self.__BUILD_MANIFEST) {
    return Promise.resolve(self.__BUILD_MANIFEST);
  }

  const onBuildManifest = new Promise(resolve => {
    // Mandatory because this is not concurrent safe:
    const cb = self.__BUILD_MANIFEST_CB;

    self.__BUILD_MANIFEST_CB = () => {
      resolve(self.__BUILD_MANIFEST);
      cb && cb();
    };
  });
  return resolvePromiseWithTimeout(onBuildManifest, MS_MAX_IDLE_DELAY, markAssetError(new Error('Failed to load client build manifest')));
}

function getFilesForRoute(assetPrefix, route) {
  if (true) {
    return Promise.resolve({
      scripts: [assetPrefix + '/_next/static/chunks/pages' + encodeURI((0, _getAssetPathFromRoute.default)(route, '.js'))],
      // Styles are handled by `style-loader` in development:
      css: []
    });
  }

  return getClientBuildManifest().then(manifest => {
    if (!(route in manifest)) {
      throw markAssetError(new Error(`Failed to lookup route: ${route}`));
    }

    const allFiles = manifest[route].map(entry => assetPrefix + '/_next/' + encodeURI(entry));
    return {
      scripts: allFiles.filter(v => v.endsWith('.js')),
      css: allFiles.filter(v => v.endsWith('.css'))
    };
  });
}

function createRouteLoader(assetPrefix) {
  const entrypoints = new Map();
  const loadedScripts = new Map();
  const styleSheets = new Map();
  const routes = new Map();

  function maybeExecuteScript(src) {
    let prom = loadedScripts.get(src);

    if (prom) {
      return prom;
    } // Skip executing script if it's already in the DOM:


    if (document.querySelector(`script[src^="${src}"]`)) {
      return Promise.resolve();
    }

    loadedScripts.set(src, prom = appendScript(src));
    return prom;
  }

  function fetchStyleSheet(href) {
    let prom = styleSheets.get(href);

    if (prom) {
      return prom;
    }

    styleSheets.set(href, prom = fetch(href).then(res => {
      if (!res.ok) {
        throw new Error(`Failed to load stylesheet: ${href}`);
      }

      return res.text().then(text => ({
        href: href,
        content: text
      }));
    }).catch(err => {
      throw markAssetError(err);
    }));
    return prom;
  }

  return {
    whenEntrypoint(route) {
      return withFuture(route, entrypoints);
    },

    onEntrypoint(route, execute) {
      Promise.resolve(execute).then(fn => fn()).then(exports => ({
        component: exports && exports.default || exports,
        exports: exports
      }), err => ({
        error: err
      })).then(input => {
        const old = entrypoints.get(route);
        entrypoints.set(route, input);
        if (old && 'resolve' in old) old.resolve(input);
      });
    },

    loadRoute(route, prefetch) {
      return withFuture(route, routes, () => {
        return resolvePromiseWithTimeout(getFilesForRoute(assetPrefix, route).then(({
          scripts,
          css
        }) => {
          return Promise.all([entrypoints.has(route) ? [] : Promise.all(scripts.map(maybeExecuteScript)), Promise.all(css.map(fetchStyleSheet))]);
        }).then(res => {
          return this.whenEntrypoint(route).then(entrypoint => ({
            entrypoint,
            styles: res[1]
          }));
        }), MS_MAX_IDLE_DELAY, markAssetError(new Error(`Route did not complete loading: ${route}`))).then(({
          entrypoint,
          styles
        }) => {
          const res = Object.assign({
            styles: styles
          }, entrypoint);
          return 'error' in entrypoint ? entrypoint : res;
        }).catch(err => {
          if (prefetch) {
            // we don't want to cache errors during prefetch
            throw err;
          }

          return {
            error: err
          };
        });
      });
    },

    prefetch(route) {
      // https://github.com/GoogleChromeLabs/quicklink/blob/453a661fa1fa940e2d2e044452398e38c67a98fb/src/index.mjs#L115-L118
      // License: Apache 2.0
      let cn;

      if (cn = navigator.connection) {
        // Don't prefetch if using 2G or if Save-Data is enabled.
        if (cn.saveData || /2g/.test(cn.effectiveType)) return Promise.resolve();
      }

      return getFilesForRoute(assetPrefix, route).then(output => Promise.all(canPrefetch ? output.scripts.map(script => prefetchViaDom(script, 'script')) : [])).then(() => {
        (0, _requestIdleCallback.requestIdleCallback)(() => this.loadRoute(route, true).catch(() => {}));
      }).catch( // swallow prefetch errors
      () => {});
    }

  };
}

var _default = createRouteLoader;
exports.default = _default;

/***/ }),

/***/ "./node_modules/next/dist/client/router.js":
/*!*************************************************!*\
  !*** ./node_modules/next/dist/client/router.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var _interopRequireWildcard = __webpack_require__(/*! @babel/runtime/helpers/interopRequireWildcard */ "./node_modules/next/node_modules/@babel/runtime/helpers/interopRequireWildcard.js");

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/next/node_modules/@babel/runtime/helpers/interopRequireDefault.js");

exports.__esModule = true;
exports.useRouter = useRouter;
exports.makePublicRouterInstance = makePublicRouterInstance;
exports.createRouter = exports.withRouter = exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));

var _router2 = _interopRequireWildcard(__webpack_require__(/*! ../next-server/lib/router/router */ "./node_modules/next/dist/next-server/lib/router/router.js"));

exports.Router = _router2.default;
exports.NextRouter = _router2.NextRouter;

var _routerContext = __webpack_require__(/*! ../next-server/lib/router-context */ "../next-server/lib/router-context");

var _withRouter = _interopRequireDefault(__webpack_require__(/*! ./with-router */ "./node_modules/next/dist/client/with-router.js"));

exports.withRouter = _withRouter.default;
/* global window */

const singletonRouter = {
  router: null,
  // holds the actual router instance
  readyCallbacks: [],

  ready(cb) {
    if (this.router) return cb();

    if (false) {}
  }

}; // Create public properties and methods of the router in the singletonRouter

const urlPropertyFields = ['pathname', 'route', 'query', 'asPath', 'components', 'isFallback', 'basePath', 'locale', 'locales', 'defaultLocale', 'isReady', 'isPreview', 'isLocaleDomain', 'domainLocales'];
const routerEvents = ['routeChangeStart', 'beforeHistoryChange', 'routeChangeComplete', 'routeChangeError', 'hashChangeStart', 'hashChangeComplete'];
const coreMethodFields = ['push', 'replace', 'reload', 'back', 'prefetch', 'beforePopState']; // Events is a static property on the router, the router doesn't have to be initialized to use it

Object.defineProperty(singletonRouter, 'events', {
  get() {
    return _router2.default.events;
  }

});
urlPropertyFields.forEach(field => {
  // Here we need to use Object.defineProperty because we need to return
  // the property assigned to the actual router
  // The value might get changed as we change routes and this is the
  // proper way to access it
  Object.defineProperty(singletonRouter, field, {
    get() {
      const router = getRouter();
      return router[field];
    }

  });
});
coreMethodFields.forEach(field => {
  // We don't really know the types here, so we add them later instead
  ;

  singletonRouter[field] = (...args) => {
    const router = getRouter();
    return router[field](...args);
  };
});
routerEvents.forEach(event => {
  singletonRouter.ready(() => {
    _router2.default.events.on(event, (...args) => {
      const eventField = `on${event.charAt(0).toUpperCase()}${event.substring(1)}`;
      const _singletonRouter = singletonRouter;

      if (_singletonRouter[eventField]) {
        try {
          _singletonRouter[eventField](...args);
        } catch (err) {
          console.error(`Error when running the Router event: ${eventField}`);
          console.error(`${err.message}\n${err.stack}`);
        }
      }
    });
  });
});

function getRouter() {
  if (!singletonRouter.router) {
    const message = 'No router instance found.\n' + 'You should only use "next/router" on the client side of your app.\n';
    throw new Error(message);
  }

  return singletonRouter.router;
} // Export the singletonRouter and this is the public API.


var _default = singletonRouter; // Reexport the withRoute HOC

exports.default = _default;

function useRouter() {
  return _react.default.useContext(_routerContext.RouterContext);
} // INTERNAL APIS
// -------------
// (do not use following exports inside the app)
// Create a router and assign it as the singleton instance.
// This is used in client side when we are initilizing the app.
// This should **not** be used inside the server.


const createRouter = (...args) => {
  singletonRouter.router = new _router2.default(...args);
  singletonRouter.readyCallbacks.forEach(cb => cb());
  singletonRouter.readyCallbacks = [];
  return singletonRouter.router;
}; // This function is used to create the `withRouter` router instance


exports.createRouter = createRouter;

function makePublicRouterInstance(router) {
  const _router = router;
  const instance = {};

  for (const property of urlPropertyFields) {
    if (typeof _router[property] === 'object') {
      instance[property] = Object.assign(Array.isArray(_router[property]) ? [] : {}, _router[property]); // makes sure query is not stateful

      continue;
    }

    instance[property] = _router[property];
  } // Events is a static property on the router, the router doesn't have to be initialized to use it


  instance.events = _router2.default.events;
  coreMethodFields.forEach(field => {
    instance[field] = (...args) => {
      return _router[field](...args);
    };
  });
  return instance;
}

/***/ }),

/***/ "./node_modules/next/dist/client/use-intersection.js":
/*!***********************************************************!*\
  !*** ./node_modules/next/dist/client/use-intersection.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.useIntersection = useIntersection;

var _react = __webpack_require__(/*! react */ "react");

var _requestIdleCallback = __webpack_require__(/*! ./request-idle-callback */ "./node_modules/next/dist/client/request-idle-callback.js");

const hasIntersectionObserver = typeof IntersectionObserver !== 'undefined';

function useIntersection({
  rootMargin,
  disabled
}) {
  const isDisabled = disabled || !hasIntersectionObserver;
  const unobserve = (0, _react.useRef)();
  const [visible, setVisible] = (0, _react.useState)(false);
  const setRef = (0, _react.useCallback)(el => {
    if (unobserve.current) {
      unobserve.current();
      unobserve.current = undefined;
    }

    if (isDisabled || visible) return;

    if (el && el.tagName) {
      unobserve.current = observe(el, isVisible => isVisible && setVisible(isVisible), {
        rootMargin
      });
    }
  }, [isDisabled, rootMargin, visible]);
  (0, _react.useEffect)(() => {
    if (!hasIntersectionObserver) {
      if (!visible) {
        const idleCallback = (0, _requestIdleCallback.requestIdleCallback)(() => setVisible(true));
        return () => (0, _requestIdleCallback.cancelIdleCallback)(idleCallback);
      }
    }
  }, [visible]);
  return [setRef, visible];
}

function observe(element, callback, options) {
  const {
    id,
    observer,
    elements
  } = createObserver(options);
  elements.set(element, callback);
  observer.observe(element);
  return function unobserve() {
    elements.delete(element);
    observer.unobserve(element); // Destroy observer when there's nothing left to watch:

    if (elements.size === 0) {
      observer.disconnect();
      observers.delete(id);
    }
  };
}

const observers = new Map();

function createObserver(options) {
  const id = options.rootMargin || '';
  let instance = observers.get(id);

  if (instance) {
    return instance;
  }

  const elements = new Map();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const callback = elements.get(entry.target);
      const isVisible = entry.isIntersecting || entry.intersectionRatio > 0;

      if (callback && isVisible) {
        callback(isVisible);
      }
    });
  }, options);
  observers.set(id, instance = {
    id,
    observer,
    elements
  });
  return instance;
}

/***/ }),

/***/ "./node_modules/next/dist/client/with-router.js":
/*!******************************************************!*\
  !*** ./node_modules/next/dist/client/with-router.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ "./node_modules/next/node_modules/@babel/runtime/helpers/interopRequireDefault.js");

exports.__esModule = true;
exports.default = withRouter;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));

var _router = __webpack_require__(/*! ./router */ "./node_modules/next/dist/client/router.js");

function withRouter(ComposedComponent) {
  function WithRouterWrapper(props) {
    return /*#__PURE__*/_react.default.createElement(ComposedComponent, Object.assign({
      router: (0, _router.useRouter)()
    }, props));
  }

  WithRouterWrapper.getInitialProps = ComposedComponent.getInitialProps // This is needed to allow checking for custom getInitialProps in _app
  ;
  WithRouterWrapper.origGetInitialProps = ComposedComponent.origGetInitialProps;

  if (true) {
    const name = ComposedComponent.displayName || ComposedComponent.name || 'Unknown';
    WithRouterWrapper.displayName = `withRouter(${name})`;
  }

  return WithRouterWrapper;
}

/***/ }),

/***/ "./node_modules/next/dist/next-server/lib/i18n/normalize-locale-path.js":
/*!******************************************************************************!*\
  !*** ./node_modules/next/dist/next-server/lib/i18n/normalize-locale-path.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


exports.__esModule = true;
exports.normalizeLocalePath = normalizeLocalePath;

function normalizeLocalePath(pathname, locales) {
  let detectedLocale; // first item will be empty string from splitting at first char

  const pathnameParts = pathname.split('/');
  (locales || []).some(locale => {
    if (pathnameParts[1].toLowerCase() === locale.toLowerCase()) {
      detectedLocale = locale;
      pathnameParts.splice(1, 1);
      pathname = pathnameParts.join('/') || '/';
      return true;
    }

    return false;
  });
  return {
    pathname,
    detectedLocale
  };
}

/***/ }),

/***/ "./node_modules/next/dist/next-server/lib/mitt.js":
/*!********************************************************!*\
  !*** ./node_modules/next/dist/next-server/lib/mitt.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


exports.__esModule = true;
exports.default = mitt;
/*
MIT License
Copyright (c) Jason Miller (https://jasonformat.com/)
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
// This file is based on https://github.com/developit/mitt/blob/v1.1.3/src/index.js
// It's been edited for the needs of this script
// See the LICENSE at the top of the file

function mitt() {
  const all = Object.create(null);
  return {
    on(type, handler) {
      ;
      (all[type] || (all[type] = [])).push(handler);
    },

    off(type, handler) {
      if (all[type]) {
        all[type].splice(all[type].indexOf(handler) >>> 0, 1);
      }
    },

    emit(type, ...evts) {
      // eslint-disable-next-line array-callback-return
      ;
      (all[type] || []).slice().map(handler => {
        handler(...evts);
      });
    }

  };
}

/***/ }),

/***/ "./node_modules/next/dist/next-server/lib/router/router.js":
/*!*****************************************************************!*\
  !*** ./node_modules/next/dist/next-server/lib/router/router.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.getDomainLocale = getDomainLocale;
exports.addLocale = addLocale;
exports.delLocale = delLocale;
exports.hasBasePath = hasBasePath;
exports.addBasePath = addBasePath;
exports.delBasePath = delBasePath;
exports.isLocalURL = isLocalURL;
exports.interpolateAs = interpolateAs;
exports.resolveHref = resolveHref;
exports.default = void 0;

var _normalizeTrailingSlash = __webpack_require__(/*! ../../../client/normalize-trailing-slash */ "./node_modules/next/dist/client/normalize-trailing-slash.js");

var _routeLoader = __webpack_require__(/*! ../../../client/route-loader */ "./node_modules/next/dist/client/route-loader.js");

var _denormalizePagePath = __webpack_require__(/*! ../../server/denormalize-page-path */ "./node_modules/next/dist/next-server/server/denormalize-page-path.js");

var _normalizeLocalePath = __webpack_require__(/*! ../i18n/normalize-locale-path */ "./node_modules/next/dist/next-server/lib/i18n/normalize-locale-path.js");

var _mitt = _interopRequireDefault(__webpack_require__(/*! ../mitt */ "./node_modules/next/dist/next-server/lib/mitt.js"));

var _utils = __webpack_require__(/*! ../utils */ "./node_modules/next/dist/next-server/lib/utils.js");

var _isDynamic = __webpack_require__(/*! ./utils/is-dynamic */ "./node_modules/next/dist/next-server/lib/router/utils/is-dynamic.js");

var _parseRelativeUrl = __webpack_require__(/*! ./utils/parse-relative-url */ "./node_modules/next/dist/next-server/lib/router/utils/parse-relative-url.js");

var _querystring = __webpack_require__(/*! ./utils/querystring */ "./node_modules/next/dist/next-server/lib/router/utils/querystring.js");

var _resolveRewrites = _interopRequireDefault(__webpack_require__(/*! ./utils/resolve-rewrites */ "?ca47"));

var _routeMatcher = __webpack_require__(/*! ./utils/route-matcher */ "./node_modules/next/dist/next-server/lib/router/utils/route-matcher.js");

var _routeRegex = __webpack_require__(/*! ./utils/route-regex */ "./node_modules/next/dist/next-server/lib/router/utils/route-regex.js");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
} // tslint:disable:no-console


let detectDomainLocale;

if (false) {}

const basePath =  false || '';

function buildCancellationError() {
  return Object.assign(new Error('Route Cancelled'), {
    cancelled: true
  });
}

function addPathPrefix(path, prefix) {
  return prefix && path.startsWith('/') ? path === '/' ? (0, _normalizeTrailingSlash.normalizePathTrailingSlash)(prefix) : `${prefix}${pathNoQueryHash(path) === '/' ? path.substring(1) : path}` : path;
}

function getDomainLocale(path, locale, locales, domainLocales) {
  if (false) {}

  return false;
}

function addLocale(path, locale, defaultLocale) {
  if (false) {}

  return path;
}

function delLocale(path, locale) {
  if (false) {}

  return path;
}

function pathNoQueryHash(path) {
  const queryIndex = path.indexOf('?');
  const hashIndex = path.indexOf('#');

  if (queryIndex > -1 || hashIndex > -1) {
    path = path.substring(0, queryIndex > -1 ? queryIndex : hashIndex);
  }

  return path;
}

function hasBasePath(path) {
  path = pathNoQueryHash(path);
  return path === basePath || path.startsWith(basePath + '/');
}

function addBasePath(path) {
  // we only add the basepath on relative urls
  return addPathPrefix(path, basePath);
}

function delBasePath(path) {
  path = path.slice(basePath.length);
  if (!path.startsWith('/')) path = `/${path}`;
  return path;
}
/**
* Detects whether a given url is routable by the Next.js router (browser only).
*/


function isLocalURL(url) {
  // prevent a hydration mismatch on href for url with anchor refs
  if (url.startsWith('/') || url.startsWith('#') || url.startsWith('?')) return true;

  try {
    // absolute urls can be local if they are on the same origin
    const locationOrigin = (0, _utils.getLocationOrigin)();
    const resolved = new URL(url, locationOrigin);
    return resolved.origin === locationOrigin && hasBasePath(resolved.pathname);
  } catch (_) {
    return false;
  }
}

function interpolateAs(route, asPathname, query) {
  let interpolatedRoute = '';
  const dynamicRegex = (0, _routeRegex.getRouteRegex)(route);
  const dynamicGroups = dynamicRegex.groups;
  const dynamicMatches = // Try to match the dynamic route against the asPath
  (asPathname !== route ? (0, _routeMatcher.getRouteMatcher)(dynamicRegex)(asPathname) : '') || // Fall back to reading the values from the href
  // TODO: should this take priority; also need to change in the router.
  query;
  interpolatedRoute = route;
  const params = Object.keys(dynamicGroups);

  if (!params.every(param => {
    let value = dynamicMatches[param] || '';
    const {
      repeat,
      optional
    } = dynamicGroups[param]; // support single-level catch-all
    // TODO: more robust handling for user-error (passing `/`)

    let replaced = `[${repeat ? '...' : ''}${param}]`;

    if (optional) {
      replaced = `${!value ? '/' : ''}[${replaced}]`;
    }

    if (repeat && !Array.isArray(value)) value = [value];
    return (optional || param in dynamicMatches) && ( // Interpolate group into data URL if present
    interpolatedRoute = interpolatedRoute.replace(replaced, repeat ? value.map( // these values should be fully encoded instead of just
    // path delimiter escaped since they are being inserted
    // into the URL and we expect URL encoded segments
    // when parsing dynamic route params
    segment => encodeURIComponent(segment)).join('/') : encodeURIComponent(value)) || '/');
  })) {
    interpolatedRoute = ''; // did not satisfy all requirements
    // n.b. We ignore this error because we handle warning for this case in
    // development in the `<Link>` component directly.
  }

  return {
    params,
    result: interpolatedRoute
  };
}

function omitParmsFromQuery(query, params) {
  const filteredQuery = {};
  Object.keys(query).forEach(key => {
    if (!params.includes(key)) {
      filteredQuery[key] = query[key];
    }
  });
  return filteredQuery;
}
/**
* Resolves a given hyperlink with a certain router state (basePath not included).
* Preserves absolute urls.
*/


function resolveHref(router, href, resolveAs) {
  // we use a dummy base url for relative urls
  let base;
  const urlAsString = typeof href === 'string' ? href : (0, _utils.formatWithValidation)(href);

  try {
    base = new URL(urlAsString.startsWith('#') ? router.asPath : router.pathname, 'http://n');
  } catch (_) {
    // fallback to / for invalid asPath values e.g. //
    base = new URL('/', 'http://n');
  } // Return because it cannot be routed by the Next.js router


  if (!isLocalURL(urlAsString)) {
    return resolveAs ? [urlAsString] : urlAsString;
  }

  try {
    const finalUrl = new URL(urlAsString, base);
    finalUrl.pathname = (0, _normalizeTrailingSlash.normalizePathTrailingSlash)(finalUrl.pathname);
    let interpolatedAs = '';

    if ((0, _isDynamic.isDynamicRoute)(finalUrl.pathname) && finalUrl.searchParams && resolveAs) {
      const query = (0, _querystring.searchParamsToUrlQuery)(finalUrl.searchParams);
      const {
        result,
        params
      } = interpolateAs(finalUrl.pathname, finalUrl.pathname, query);

      if (result) {
        interpolatedAs = (0, _utils.formatWithValidation)({
          pathname: result,
          hash: finalUrl.hash,
          query: omitParmsFromQuery(query, params)
        });
      }
    } // if the origin didn't change, it means we received a relative href


    const resolvedHref = finalUrl.origin === base.origin ? finalUrl.href.slice(finalUrl.origin.length) : finalUrl.href;
    return resolveAs ? [resolvedHref, interpolatedAs || resolvedHref] : resolvedHref;
  } catch (_) {
    return resolveAs ? [urlAsString] : urlAsString;
  }
}

function stripOrigin(url) {
  const origin = (0, _utils.getLocationOrigin)();
  return url.startsWith(origin) ? url.substring(origin.length) : url;
}

function prepareUrlAs(router, url, as) {
  // If url and as provided as an object representation,
  // we'll format them into the string version here.
  let [resolvedHref, resolvedAs] = resolveHref(router, url, true);
  const origin = (0, _utils.getLocationOrigin)();
  const hrefHadOrigin = resolvedHref.startsWith(origin);
  const asHadOrigin = resolvedAs && resolvedAs.startsWith(origin);
  resolvedHref = stripOrigin(resolvedHref);
  resolvedAs = resolvedAs ? stripOrigin(resolvedAs) : resolvedAs;
  const preparedUrl = hrefHadOrigin ? resolvedHref : addBasePath(resolvedHref);
  const preparedAs = as ? stripOrigin(resolveHref(router, as)) : resolvedAs || resolvedHref;
  return {
    url: preparedUrl,
    as: asHadOrigin ? preparedAs : addBasePath(preparedAs)
  };
}

function resolveDynamicRoute(pathname, pages) {
  const cleanPathname = (0, _normalizeTrailingSlash.removePathTrailingSlash)((0, _denormalizePagePath.denormalizePagePath)(pathname));

  if (cleanPathname === '/404' || cleanPathname === '/_error') {
    return pathname;
  } // handle resolving href for dynamic routes


  if (!pages.includes(cleanPathname)) {
    // eslint-disable-next-line array-callback-return
    pages.some(page => {
      if ((0, _isDynamic.isDynamicRoute)(page) && (0, _routeRegex.getRouteRegex)(page).re.test(cleanPathname)) {
        pathname = page;
        return true;
      }
    });
  }

  return (0, _normalizeTrailingSlash.removePathTrailingSlash)(pathname);
}

const manualScrollRestoration =  false && 0;
const SSG_DATA_NOT_FOUND = Symbol('SSG_DATA_NOT_FOUND');

function fetchRetry(url, attempts) {
  return fetch(url, {
    // Cookies are required to be present for Next.js' SSG "Preview Mode".
    // Cookies may also be required for `getServerSideProps`.
    //
    // > `fetch` won’t send cookies, unless you set the credentials init
    // > option.
    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    //
    // > For maximum browser compatibility when it comes to sending &
    // > receiving cookies, always supply the `credentials: 'same-origin'`
    // > option instead of relying on the default.
    // https://github.com/github/fetch#caveats
    credentials: 'same-origin'
  }).then(res => {
    if (!res.ok) {
      if (attempts > 1 && res.status >= 500) {
        return fetchRetry(url, attempts - 1);
      }

      if (res.status === 404) {
        return res.json().then(data => {
          if (data.notFound) {
            return {
              notFound: SSG_DATA_NOT_FOUND
            };
          }

          throw new Error(`Failed to load static props`);
        });
      }

      throw new Error(`Failed to load static props`);
    }

    return res.json();
  });
}

function fetchNextData(dataHref, isServerRender) {
  return fetchRetry(dataHref, isServerRender ? 3 : 1).catch(err => {
    // We should only trigger a server-side transition if this was caused
    // on a client-side transition. Otherwise, we'd get into an infinite
    // loop.
    if (!isServerRender) {
      (0, _routeLoader.markAssetError)(err);
    }

    throw err;
  });
}

class Router {
  /**
  * Map of all components loaded in `Router`
  */
  // Static Data Cache
  // In-flight Server Data Requests, for deduping
  constructor(_pathname, _query, _as, {
    initialProps,
    pageLoader,
    App,
    wrapApp,
    Component,
    err,
    subscription,
    isFallback,
    locale,
    locales,
    defaultLocale,
    domainLocales,
    isPreview
  }) {
    this.route = void 0;
    this.pathname = void 0;
    this.query = void 0;
    this.asPath = void 0;
    this.basePath = void 0;
    this.components = void 0;
    this.sdc = {};
    this.sdr = {};
    this.sub = void 0;
    this.clc = void 0;
    this.pageLoader = void 0;
    this._bps = void 0;
    this.events = void 0;
    this._wrapApp = void 0;
    this.isSsr = void 0;
    this.isFallback = void 0;
    this._inFlightRoute = void 0;
    this._shallow = void 0;
    this.locale = void 0;
    this.locales = void 0;
    this.defaultLocale = void 0;
    this.domainLocales = void 0;
    this.isReady = void 0;
    this.isPreview = void 0;
    this.isLocaleDomain = void 0;
    this._idx = 0;

    this.onPopState = e => {
      const state = e.state;

      if (!state) {
        // We get state as undefined for two reasons.
        //  1. With older safari (< 8) and older chrome (< 34)
        //  2. When the URL changed with #
        //
        // In the both cases, we don't need to proceed and change the route.
        // (as it's already changed)
        // But we can simply replace the state with the new changes.
        // Actually, for (1) we don't need to nothing. But it's hard to detect that event.
        // So, doing the following for (1) does no harm.
        const {
          pathname,
          query
        } = this;
        this.changeState('replaceState', (0, _utils.formatWithValidation)({
          pathname: addBasePath(pathname),
          query
        }), (0, _utils.getURL)());
        return;
      }

      if (!state.__N) {
        return;
      }

      let forcedScroll;
      const {
        url,
        as,
        options,
        idx
      } = state;

      if (false) {}

      this._idx = idx;
      const {
        pathname
      } = (0, _parseRelativeUrl.parseRelativeUrl)(url); // Make sure we don't re-render on initial load,
      // can be caused by navigating back from an external site

      if (this.isSsr && as === this.asPath && pathname === this.pathname) {
        return;
      } // If the downstream application returns falsy, return.
      // They will then be responsible for handling the event.


      if (this._bps && !this._bps(state)) {
        return;
      }

      this.change('replaceState', url, as, Object.assign({}, options, {
        shallow: options.shallow && this._shallow,
        locale: options.locale || this.defaultLocale
      }), forcedScroll);
    }; // represents the current component key


    this.route = (0, _normalizeTrailingSlash.removePathTrailingSlash)(_pathname); // set up the component cache (by route keys)

    this.components = {}; // We should not keep the cache, if there's an error
    // Otherwise, this cause issues when when going back and
    // come again to the errored page.

    if (_pathname !== '/_error') {
      this.components[this.route] = {
        Component,
        initial: true,
        props: initialProps,
        err,
        __N_SSG: initialProps && initialProps.__N_SSG,
        __N_SSP: initialProps && initialProps.__N_SSP
      };
    }

    this.components['/_app'] = {
      Component: App,
      styleSheets: [
        /* /_app does not need its stylesheets managed */
      ]
    }; // Backwards compat for Router.router.events
    // TODO: Should be remove the following major version as it was never documented

    this.events = Router.events;
    this.pageLoader = pageLoader;
    this.pathname = _pathname;
    this.query = _query; // if auto prerendered and dynamic route wait to update asPath
    // until after mount to prevent hydration mismatch

    const autoExportDynamic = (0, _isDynamic.isDynamicRoute)(_pathname) && self.__NEXT_DATA__.autoExport;

    this.asPath = autoExportDynamic ? _pathname : _as;
    this.basePath = basePath;
    this.sub = subscription;
    this.clc = null;
    this._wrapApp = wrapApp; // make sure to ignore extra popState in safari on navigating
    // back from external site

    this.isSsr = true;
    this.isFallback = isFallback;
    this.isReady = !!(self.__NEXT_DATA__.gssp || self.__NEXT_DATA__.gip || !autoExportDynamic && !self.location.search && !false);
    this.isPreview = !!isPreview;
    this.isLocaleDomain = false;

    if (false) {}

    if (false) {}
  }

  reload() {
    window.location.reload();
  }
  /**
  * Go back in history
  */


  back() {
    window.history.back();
  }
  /**
  * Performs a `pushState` with arguments
  * @param url of the route
  * @param as masks `url` for the browser
  * @param options object you can define `shallow` and other options
  */


  push(url, as, options = {}) {
    if (false) {}

    ;
    ({
      url,
      as
    } = prepareUrlAs(this, url, as));
    return this.change('pushState', url, as, options);
  }
  /**
  * Performs a `replaceState` with arguments
  * @param url of the route
  * @param as masks `url` for the browser
  * @param options object you can define `shallow` and other options
  */


  replace(url, as, options = {}) {
    ;
    ({
      url,
      as
    } = prepareUrlAs(this, url, as));
    return this.change('replaceState', url, as, options);
  }

  async change(method, url, as, options, forcedScroll) {
    if (!isLocalURL(url)) {
      window.location.href = url;
      return false;
    }

    const shouldResolveHref = url === as || options._h || options._shouldResolveHref; // for static pages with query params in the URL we delay
    // marking the router ready until after the query is updated

    if (options._h) {
      this.isReady = true;
    }

    let localeChange = options.locale !== this.locale;

    if (false) { var _this$locales; }

    if (!options._h) {
      this.isSsr = false;
    } // marking route changes as a navigation start entry


    if (_utils.ST) {
      performance.mark('routeChange');
    }

    const {
      shallow = false
    } = options;
    const routeProps = {
      shallow
    };

    if (this._inFlightRoute) {
      this.abortComponentLoad(this._inFlightRoute, routeProps);
    }

    as = addBasePath(addLocale(hasBasePath(as) ? delBasePath(as) : as, options.locale, this.defaultLocale));
    const cleanedAs = delLocale(hasBasePath(as) ? delBasePath(as) : as, this.locale);
    this._inFlightRoute = as; // If the url change is only related to a hash change
    // We should not proceed. We should only change the state.
    // WARNING: `_h` is an internal option for handing Next.js client-side
    // hydration. Your app should _never_ use this property. It may change at
    // any time without notice.

    if (!options._h && this.onlyAHashChange(cleanedAs)) {
      this.asPath = cleanedAs;
      Router.events.emit('hashChangeStart', as, routeProps); // TODO: do we need the resolved href when only a hash change?

      this.changeState(method, url, as, options);
      this.scrollToHash(cleanedAs);
      this.notify(this.components[this.route], null);
      Router.events.emit('hashChangeComplete', as, routeProps);
      return true;
    }

    let parsed = (0, _parseRelativeUrl.parseRelativeUrl)(url);
    let {
      pathname,
      query
    } = parsed; // The build manifest needs to be loaded before auto-static dynamic pages
    // get their query parameters to allow ensuring they can be parsed properly
    // when rewritten to

    let pages, rewrites;

    try {
      pages = await this.pageLoader.getPageList();
      ({
        __rewrites: rewrites
      } = await (0, _routeLoader.getClientBuildManifest)());
    } catch (err) {
      // If we fail to resolve the page list or client-build manifest, we must
      // do a server-side transition:
      window.location.href = as;
      return false;
    } // If asked to change the current URL we should reload the current page
    // (not location.reload() but reload getInitialProps and other Next.js stuffs)
    // We also need to set the method = replaceState always
    // as this should not go into the history (That's how browsers work)
    // We should compare the new asPath to the current asPath, not the url


    if (!this.urlIsNew(cleanedAs) && !localeChange) {
      method = 'replaceState';
    } // we need to resolve the as value using rewrites for dynamic SSG
    // pages to allow building the data URL correctly


    let resolvedAs = as; // url and as should always be prefixed with basePath by this
    // point by either next/link or router.push/replace so strip the
    // basePath from the pathname to match the pages dir 1-to-1

    pathname = pathname ? (0, _normalizeTrailingSlash.removePathTrailingSlash)(delBasePath(pathname)) : pathname;

    if (shouldResolveHref && pathname !== '/_error') {
      ;
      options._shouldResolveHref = true;

      if (false) {} else {
        parsed.pathname = resolveDynamicRoute(pathname, pages);

        if (parsed.pathname !== pathname) {
          pathname = parsed.pathname;
          parsed.pathname = addBasePath(pathname);
          url = (0, _utils.formatWithValidation)(parsed);
        }
      }
    }

    const route = (0, _normalizeTrailingSlash.removePathTrailingSlash)(pathname);

    if (!isLocalURL(as)) {
      if (true) {
        throw new Error(`Invalid href: "${url}" and as: "${as}", received relative href and external as` + `\nSee more info: https://nextjs.org/docs/messages/invalid-relative-url-external-as`);
      }

      window.location.href = as;
      return false;
    }

    resolvedAs = delLocale(delBasePath(resolvedAs), this.locale);

    if ((0, _isDynamic.isDynamicRoute)(route)) {
      const parsedAs = (0, _parseRelativeUrl.parseRelativeUrl)(resolvedAs);
      const asPathname = parsedAs.pathname;
      const routeRegex = (0, _routeRegex.getRouteRegex)(route);
      const routeMatch = (0, _routeMatcher.getRouteMatcher)(routeRegex)(asPathname);
      const shouldInterpolate = route === asPathname;
      const interpolatedAs = shouldInterpolate ? interpolateAs(route, asPathname, query) : {};

      if (!routeMatch || shouldInterpolate && !interpolatedAs.result) {
        const missingParams = Object.keys(routeRegex.groups).filter(param => !query[param]);

        if (missingParams.length > 0) {
          if (true) {
            console.warn(`${shouldInterpolate ? `Interpolating href` : `Mismatching \`as\` and \`href\``} failed to manually provide ` + `the params: ${missingParams.join(', ')} in the \`href\`'s \`query\``);
          }

          throw new Error((shouldInterpolate ? `The provided \`href\` (${url}) value is missing query values (${missingParams.join(', ')}) to be interpolated properly. ` : `The provided \`as\` value (${asPathname}) is incompatible with the \`href\` value (${route}). `) + `Read more: https://nextjs.org/docs/messages/${shouldInterpolate ? 'href-interpolation-failed' : 'incompatible-href-as'}`);
        }
      } else if (shouldInterpolate) {
        as = (0, _utils.formatWithValidation)(Object.assign({}, parsedAs, {
          pathname: interpolatedAs.result,
          query: omitParmsFromQuery(query, interpolatedAs.params)
        }));
      } else {
        // Merge params into `query`, overwriting any specified in search
        Object.assign(query, routeMatch);
      }
    }

    Router.events.emit('routeChangeStart', as, routeProps);

    try {
      var _self$__NEXT_DATA__$p, _self$__NEXT_DATA__$p2, _options$scroll;

      let routeInfo = await this.getRouteInfo(route, pathname, query, as, resolvedAs, routeProps);
      let {
        error,
        props,
        __N_SSG,
        __N_SSP
      } = routeInfo; // handle redirect on client-transition

      if ((__N_SSG || __N_SSP) && props) {
        if (props.pageProps && props.pageProps.__N_REDIRECT) {
          const destination = props.pageProps.__N_REDIRECT; // check if destination is internal (resolves to a page) and attempt
          // client-navigation if it is falling back to hard navigation if
          // it's not

          if (destination.startsWith('/')) {
            const parsedHref = (0, _parseRelativeUrl.parseRelativeUrl)(destination);
            parsedHref.pathname = resolveDynamicRoute(parsedHref.pathname, pages);
            const {
              url: newUrl,
              as: newAs
            } = prepareUrlAs(this, destination, destination);
            return this.change(method, newUrl, newAs, options);
          }

          window.location.href = destination;
          return new Promise(() => {});
        }

        this.isPreview = !!props.__N_PREVIEW; // handle SSG data 404

        if (props.notFound === SSG_DATA_NOT_FOUND) {
          let notFoundRoute;

          try {
            await this.fetchComponent('/404');
            notFoundRoute = '/404';
          } catch (_) {
            notFoundRoute = '/_error';
          }

          routeInfo = await this.getRouteInfo(notFoundRoute, notFoundRoute, query, as, resolvedAs, {
            shallow: false
          });
        }
      }

      Router.events.emit('beforeHistoryChange', as, routeProps);
      this.changeState(method, url, as, options);

      if (true) {
        const appComp = this.components['/_app'].Component;
        window.next.isPrerendered = appComp.getInitialProps === appComp.origGetInitialProps && !routeInfo.Component.getInitialProps;
      }

      if (options._h && pathname === '/_error' && ((_self$__NEXT_DATA__$p = self.__NEXT_DATA__.props) == null ? void 0 : (_self$__NEXT_DATA__$p2 = _self$__NEXT_DATA__$p.pageProps) == null ? void 0 : _self$__NEXT_DATA__$p2.statusCode) === 500 && props != null && props.pageProps) {
        // ensure statusCode is still correct for static 500 page
        // when updating query information
        props.pageProps.statusCode = 500;
      } // shallow routing is only allowed for same page URL changes.


      const isValidShallowRoute = options.shallow && this.route === route;
      const shouldScroll = (_options$scroll = options.scroll) != null ? _options$scroll : !isValidShallowRoute;
      const resetScroll = shouldScroll ? {
        x: 0,
        y: 0
      } : null;
      await this.set(route, pathname, query, cleanedAs, routeInfo, forcedScroll != null ? forcedScroll : resetScroll).catch(e => {
        if (e.cancelled) error = error || e;else throw e;
      });

      if (error) {
        Router.events.emit('routeChangeError', error, cleanedAs, routeProps);
        throw error;
      }

      if (false) {}

      Router.events.emit('routeChangeComplete', as, routeProps);
      return true;
    } catch (err) {
      if (err.cancelled) {
        return false;
      }

      throw err;
    }
  }

  changeState(method, url, as, options = {}) {
    if (true) {
      if (typeof window.history === 'undefined') {
        console.error(`Warning: window.history is not available.`);
        return;
      }

      if (typeof window.history[method] === 'undefined') {
        console.error(`Warning: window.history.${method} is not available`);
        return;
      }
    }

    if (method !== 'pushState' || (0, _utils.getURL)() !== as) {
      this._shallow = options.shallow;
      window.history[method]({
        url,
        as,
        options,
        __N: true,
        idx: this._idx = method !== 'pushState' ? this._idx : this._idx + 1
      }, // Most browsers currently ignores this parameter, although they may use it in the future.
      // Passing the empty string here should be safe against future changes to the method.
      // https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState
      '', as);
    }
  }

  async handleRouteInfoError(err, pathname, query, as, routeProps, loadErrorFail) {
    if (err.cancelled) {
      // bubble up cancellation errors
      throw err;
    }

    if ((0, _routeLoader.isAssetError)(err) || loadErrorFail) {
      Router.events.emit('routeChangeError', err, as, routeProps); // If we can't load the page it could be one of following reasons
      //  1. Page doesn't exists
      //  2. Page does exist in a different zone
      //  3. Internal error while loading the page
      // So, doing a hard reload is the proper way to deal with this.

      window.location.href = as; // Changing the URL doesn't block executing the current code path.
      // So let's throw a cancellation error stop the routing logic.

      throw buildCancellationError();
    }

    try {
      let Component;
      let styleSheets;
      let props;

      if (typeof Component === 'undefined' || typeof styleSheets === 'undefined') {
        ;
        ({
          page: Component,
          styleSheets
        } = await this.fetchComponent('/_error'));
      }

      const routeInfo = {
        props,
        Component,
        styleSheets,
        err,
        error: err
      };

      if (!routeInfo.props) {
        try {
          routeInfo.props = await this.getInitialProps(Component, {
            err,
            pathname,
            query
          });
        } catch (gipErr) {
          console.error('Error in error page `getInitialProps`: ', gipErr);
          routeInfo.props = {};
        }
      }

      return routeInfo;
    } catch (routeInfoErr) {
      return this.handleRouteInfoError(routeInfoErr, pathname, query, as, routeProps, true);
    }
  }

  async getRouteInfo(route, pathname, query, as, resolvedAs, routeProps) {
    try {
      const existingRouteInfo = this.components[route];

      if (routeProps.shallow && existingRouteInfo && this.route === route) {
        return existingRouteInfo;
      }

      const cachedRouteInfo = existingRouteInfo && 'initial' in existingRouteInfo ? undefined : existingRouteInfo;
      const routeInfo = cachedRouteInfo ? cachedRouteInfo : await this.fetchComponent(route).then(res => ({
        Component: res.page,
        styleSheets: res.styleSheets,
        __N_SSG: res.mod.__N_SSG,
        __N_SSP: res.mod.__N_SSP
      }));
      const {
        Component,
        __N_SSG,
        __N_SSP
      } = routeInfo;

      if (true) {
        const {
          isValidElementType
        } = __webpack_require__(/*! react-is */ "react-is");

        if (!isValidElementType(Component)) {
          throw new Error(`The default export is not a React Component in page: "${pathname}"`);
        }
      }

      let dataHref;

      if (__N_SSG || __N_SSP) {
        dataHref = this.pageLoader.getDataHref((0, _utils.formatWithValidation)({
          pathname,
          query
        }), resolvedAs, __N_SSG, this.locale);
      }

      const props = await this._getData(() => __N_SSG ? this._getStaticData(dataHref) : __N_SSP ? this._getServerData(dataHref) : this.getInitialProps(Component, // we provide AppTree later so this needs to be `any`
      {
        pathname,
        query,
        asPath: as,
        locale: this.locale,
        locales: this.locales,
        defaultLocale: this.defaultLocale
      }));
      routeInfo.props = props;
      this.components[route] = routeInfo;
      return routeInfo;
    } catch (err) {
      return this.handleRouteInfoError(err, pathname, query, as, routeProps);
    }
  }

  set(route, pathname, query, as, data, resetScroll) {
    this.isFallback = false;
    this.route = route;
    this.pathname = pathname;
    this.query = query;
    this.asPath = as;
    return this.notify(data, resetScroll);
  }
  /**
  * Callback to execute before replacing router state
  * @param cb callback to be executed
  */


  beforePopState(cb) {
    this._bps = cb;
  }

  onlyAHashChange(as) {
    if (!this.asPath) return false;
    const [oldUrlNoHash, oldHash] = this.asPath.split('#');
    const [newUrlNoHash, newHash] = as.split('#'); // Makes sure we scroll to the provided hash if the url/hash are the same

    if (newHash && oldUrlNoHash === newUrlNoHash && oldHash === newHash) {
      return true;
    } // If the urls are change, there's more than a hash change


    if (oldUrlNoHash !== newUrlNoHash) {
      return false;
    } // If the hash has changed, then it's a hash only change.
    // This check is necessary to handle both the enter and
    // leave hash === '' cases. The identity case falls through
    // and is treated as a next reload.


    return oldHash !== newHash;
  }

  scrollToHash(as) {
    const [, hash] = as.split('#'); // Scroll to top if the hash is just `#` with no value or `#top`
    // To mirror browsers

    if (hash === '' || hash === 'top') {
      window.scrollTo(0, 0);
      return;
    } // First we check if the element by id is found


    const idEl = document.getElementById(hash);

    if (idEl) {
      idEl.scrollIntoView();
      return;
    } // If there's no element with the id, we check the `name` property
    // To mirror browsers


    const nameEl = document.getElementsByName(hash)[0];

    if (nameEl) {
      nameEl.scrollIntoView();
    }
  }

  urlIsNew(asPath) {
    return this.asPath !== asPath;
  }
  /**
  * Prefetch page code, you may wait for the data during page rendering.
  * This feature only works in production!
  * @param url the href of prefetched page
  * @param asPath the as path of the prefetched page
  */


  async prefetch(url, asPath = url, options = {}) {
    let parsed = (0, _parseRelativeUrl.parseRelativeUrl)(url);
    let {
      pathname
    } = parsed;

    if (false) {}

    const pages = await this.pageLoader.getPageList();
    let resolvedAs = asPath;

    if (false) {} else {
      parsed.pathname = resolveDynamicRoute(parsed.pathname, pages);

      if (parsed.pathname !== pathname) {
        pathname = parsed.pathname;
        parsed.pathname = pathname;
        url = (0, _utils.formatWithValidation)(parsed);
      }
    }

    const route = (0, _normalizeTrailingSlash.removePathTrailingSlash)(pathname); // Prefetch is not supported in development mode because it would trigger on-demand-entries

    if (true) {
      return;
    }

    await Promise.all([this.pageLoader._isSsg(route).then(isSsg => {
      return isSsg ? this._getStaticData(this.pageLoader.getDataHref(url, resolvedAs, true, typeof options.locale !== 'undefined' ? options.locale : this.locale)) : false;
    }), this.pageLoader[options.priority ? 'loadPage' : 'prefetch'](route)]);
  }

  async fetchComponent(route) {
    let cancelled = false;

    const cancel = this.clc = () => {
      cancelled = true;
    };

    const componentResult = await this.pageLoader.loadPage(route);

    if (cancelled) {
      const error = new Error(`Abort fetching component for route: "${route}"`);
      error.cancelled = true;
      throw error;
    }

    if (cancel === this.clc) {
      this.clc = null;
    }

    return componentResult;
  }

  _getData(fn) {
    let cancelled = false;

    const cancel = () => {
      cancelled = true;
    };

    this.clc = cancel;
    return fn().then(data => {
      if (cancel === this.clc) {
        this.clc = null;
      }

      if (cancelled) {
        const err = new Error('Loading initial props cancelled');
        err.cancelled = true;
        throw err;
      }

      return data;
    });
  }

  _getStaticData(dataHref) {
    const {
      href: cacheKey
    } = new URL(dataHref, window.location.href);

    if (false) {}

    return fetchNextData(dataHref, this.isSsr).then(data => {
      this.sdc[cacheKey] = data;
      return data;
    });
  }

  _getServerData(dataHref) {
    const {
      href: resourceKey
    } = new URL(dataHref, window.location.href);

    if (this.sdr[resourceKey]) {
      return this.sdr[resourceKey];
    }

    return this.sdr[resourceKey] = fetchNextData(dataHref, this.isSsr).then(data => {
      delete this.sdr[resourceKey];
      return data;
    }).catch(err => {
      delete this.sdr[resourceKey];
      throw err;
    });
  }

  getInitialProps(Component, ctx) {
    const {
      Component: App
    } = this.components['/_app'];

    const AppTree = this._wrapApp(App);

    ctx.AppTree = AppTree;
    return (0, _utils.loadGetInitialProps)(App, {
      AppTree,
      Component,
      router: this,
      ctx
    });
  }

  abortComponentLoad(as, routeProps) {
    if (this.clc) {
      Router.events.emit('routeChangeError', buildCancellationError(), as, routeProps);
      this.clc();
      this.clc = null;
    }
  }

  notify(data, resetScroll) {
    return this.sub(data, this.components['/_app'].Component, resetScroll);
  }

}

exports.default = Router;
Router.events = (0, _mitt.default)();

/***/ }),

/***/ "./node_modules/next/dist/next-server/lib/router/utils/format-url.js":
/*!***************************************************************************!*\
  !*** ./node_modules/next/dist/next-server/lib/router/utils/format-url.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.formatUrl = formatUrl;

var querystring = _interopRequireWildcard(__webpack_require__(/*! ./querystring */ "./node_modules/next/dist/next-server/lib/router/utils/querystring.js"));

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
} // Format function modified from nodejs
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.


const slashedProtocols = /https?|ftp|gopher|file/;

function formatUrl(urlObj) {
  let {
    auth,
    hostname
  } = urlObj;
  let protocol = urlObj.protocol || '';
  let pathname = urlObj.pathname || '';
  let hash = urlObj.hash || '';
  let query = urlObj.query || '';
  let host = false;
  auth = auth ? encodeURIComponent(auth).replace(/%3A/i, ':') + '@' : '';

  if (urlObj.host) {
    host = auth + urlObj.host;
  } else if (hostname) {
    host = auth + (~hostname.indexOf(':') ? `[${hostname}]` : hostname);

    if (urlObj.port) {
      host += ':' + urlObj.port;
    }
  }

  if (query && typeof query === 'object') {
    query = String(querystring.urlQueryToSearchParams(query));
  }

  let search = urlObj.search || query && `?${query}` || '';
  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  if (urlObj.slashes || (!protocol || slashedProtocols.test(protocol)) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname[0] !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash[0] !== '#') hash = '#' + hash;
  if (search && search[0] !== '?') search = '?' + search;
  pathname = pathname.replace(/[?#]/g, encodeURIComponent);
  search = search.replace('#', '%23');
  return `${protocol}${host}${pathname}${search}${hash}`;
}

/***/ }),

/***/ "./node_modules/next/dist/next-server/lib/router/utils/is-dynamic.js":
/*!***************************************************************************!*\
  !*** ./node_modules/next/dist/next-server/lib/router/utils/is-dynamic.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


exports.__esModule = true;
exports.isDynamicRoute = isDynamicRoute; // Identify /[param]/ in route string

const TEST_ROUTE = /\/\[[^/]+?\](?=\/|$)/;

function isDynamicRoute(route) {
  return TEST_ROUTE.test(route);
}

/***/ }),

/***/ "./node_modules/next/dist/next-server/lib/router/utils/parse-relative-url.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/next/dist/next-server/lib/router/utils/parse-relative-url.js ***!
  \***********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.parseRelativeUrl = parseRelativeUrl;

var _utils = __webpack_require__(/*! ../../utils */ "./node_modules/next/dist/next-server/lib/utils.js");

var _querystring = __webpack_require__(/*! ./querystring */ "./node_modules/next/dist/next-server/lib/router/utils/querystring.js");
/**
* Parses path-relative urls (e.g. `/hello/world?foo=bar`). If url isn't path-relative
* (e.g. `./hello`) then at least base must be.
* Absolute urls are rejected with one exception, in the browser, absolute urls that are on
* the current origin will be parsed as relative
*/


function parseRelativeUrl(url, base) {
  const globalBase = new URL( true ? 'http://n' : 0);
  const resolvedBase = base ? new URL(base, globalBase) : globalBase;
  const {
    pathname,
    searchParams,
    search,
    hash,
    href,
    origin
  } = new URL(url, resolvedBase);

  if (origin !== globalBase.origin) {
    throw new Error(`invariant: invalid relative URL, router received ${url}`);
  }

  return {
    pathname,
    query: (0, _querystring.searchParamsToUrlQuery)(searchParams),
    search,
    hash,
    href: href.slice(globalBase.origin.length)
  };
}

/***/ }),

/***/ "./node_modules/next/dist/next-server/lib/router/utils/querystring.js":
/*!****************************************************************************!*\
  !*** ./node_modules/next/dist/next-server/lib/router/utils/querystring.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


exports.__esModule = true;
exports.searchParamsToUrlQuery = searchParamsToUrlQuery;
exports.urlQueryToSearchParams = urlQueryToSearchParams;
exports.assign = assign;

function searchParamsToUrlQuery(searchParams) {
  const query = {};
  searchParams.forEach((value, key) => {
    if (typeof query[key] === 'undefined') {
      query[key] = value;
    } else if (Array.isArray(query[key])) {
      ;
      query[key].push(value);
    } else {
      query[key] = [query[key], value];
    }
  });
  return query;
}

function stringifyUrlQueryParam(param) {
  if (typeof param === 'string' || typeof param === 'number' && !isNaN(param) || typeof param === 'boolean') {
    return String(param);
  } else {
    return '';
  }
}

function urlQueryToSearchParams(urlQuery) {
  const result = new URLSearchParams();
  Object.entries(urlQuery).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(item => result.append(key, stringifyUrlQueryParam(item)));
    } else {
      result.set(key, stringifyUrlQueryParam(value));
    }
  });
  return result;
}

function assign(target, ...searchParamsList) {
  searchParamsList.forEach(searchParams => {
    Array.from(searchParams.keys()).forEach(key => target.delete(key));
    searchParams.forEach((value, key) => target.append(key, value));
  });
  return target;
}

/***/ }),

/***/ "./node_modules/next/dist/next-server/lib/router/utils/route-matcher.js":
/*!******************************************************************************!*\
  !*** ./node_modules/next/dist/next-server/lib/router/utils/route-matcher.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


exports.__esModule = true;
exports.getRouteMatcher = getRouteMatcher;

function getRouteMatcher(routeRegex) {
  const {
    re,
    groups
  } = routeRegex;
  return pathname => {
    const routeMatch = re.exec(pathname);

    if (!routeMatch) {
      return false;
    }

    const decode = param => {
      try {
        return decodeURIComponent(param);
      } catch (_) {
        const err = new Error('failed to decode param');
        err.code = 'DECODE_FAILED';
        throw err;
      }
    };

    const params = {};
    Object.keys(groups).forEach(slugName => {
      const g = groups[slugName];
      const m = routeMatch[g.pos];

      if (m !== undefined) {
        params[slugName] = ~m.indexOf('/') ? m.split('/').map(entry => decode(entry)) : g.repeat ? [decode(m)] : decode(m);
      }
    });
    return params;
  };
}

/***/ }),

/***/ "./node_modules/next/dist/next-server/lib/router/utils/route-regex.js":
/*!****************************************************************************!*\
  !*** ./node_modules/next/dist/next-server/lib/router/utils/route-regex.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


exports.__esModule = true;
exports.getRouteRegex = getRouteRegex; // this isn't importing the escape-string-regex module
// to reduce bytes

function escapeRegex(str) {
  return str.replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&');
}

function parseParameter(param) {
  const optional = param.startsWith('[') && param.endsWith(']');

  if (optional) {
    param = param.slice(1, -1);
  }

  const repeat = param.startsWith('...');

  if (repeat) {
    param = param.slice(3);
  }

  return {
    key: param,
    repeat,
    optional
  };
}

function getRouteRegex(normalizedRoute) {
  const segments = (normalizedRoute.replace(/\/$/, '') || '/').slice(1).split('/');
  const groups = {};
  let groupIndex = 1;
  const parameterizedRoute = segments.map(segment => {
    if (segment.startsWith('[') && segment.endsWith(']')) {
      const {
        key,
        optional,
        repeat
      } = parseParameter(segment.slice(1, -1));
      groups[key] = {
        pos: groupIndex++,
        repeat,
        optional
      };
      return repeat ? optional ? '(?:/(.+?))?' : '/(.+?)' : '/([^/]+?)';
    } else {
      return `/${escapeRegex(segment)}`;
    }
  }).join(''); // dead code eliminate for browser since it's only needed
  // while generating routes-manifest

  if (true) {
    let routeKeyCharCode = 97;
    let routeKeyCharLength = 1; // builds a minimal routeKey using only a-z and minimal number of characters

    const getSafeRouteKey = () => {
      let routeKey = '';

      for (let i = 0; i < routeKeyCharLength; i++) {
        routeKey += String.fromCharCode(routeKeyCharCode);
        routeKeyCharCode++;

        if (routeKeyCharCode > 122) {
          routeKeyCharLength++;
          routeKeyCharCode = 97;
        }
      }

      return routeKey;
    };

    const routeKeys = {};
    let namedParameterizedRoute = segments.map(segment => {
      if (segment.startsWith('[') && segment.endsWith(']')) {
        const {
          key,
          optional,
          repeat
        } = parseParameter(segment.slice(1, -1)); // replace any non-word characters since they can break
        // the named regex

        let cleanedKey = key.replace(/\W/g, '');
        let invalidKey = false; // check if the key is still invalid and fallback to using a known
        // safe key

        if (cleanedKey.length === 0 || cleanedKey.length > 30) {
          invalidKey = true;
        }

        if (!isNaN(parseInt(cleanedKey.substr(0, 1)))) {
          invalidKey = true;
        }

        if (invalidKey) {
          cleanedKey = getSafeRouteKey();
        }

        routeKeys[cleanedKey] = key;
        return repeat ? optional ? `(?:/(?<${cleanedKey}>.+?))?` : `/(?<${cleanedKey}>.+?)` : `/(?<${cleanedKey}>[^/]+?)`;
      } else {
        return `/${escapeRegex(segment)}`;
      }
    }).join('');
    return {
      re: new RegExp(`^${parameterizedRoute}(?:/)?$`),
      groups,
      routeKeys,
      namedRegex: `^${namedParameterizedRoute}(?:/)?$`
    };
  }

  return {
    re: new RegExp(`^${parameterizedRoute}(?:/)?$`),
    groups
  };
}

/***/ }),

/***/ "./node_modules/next/dist/next-server/lib/utils.js":
/*!*********************************************************!*\
  !*** ./node_modules/next/dist/next-server/lib/utils.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.execOnce = execOnce;
exports.getLocationOrigin = getLocationOrigin;
exports.getURL = getURL;
exports.getDisplayName = getDisplayName;
exports.isResSent = isResSent;
exports.loadGetInitialProps = loadGetInitialProps;
exports.formatWithValidation = formatWithValidation;
exports.ST = exports.SP = exports.urlObjectKeys = void 0;

var _formatUrl = __webpack_require__(/*! ./router/utils/format-url */ "./node_modules/next/dist/next-server/lib/router/utils/format-url.js");
/**
* Utils
*/


function execOnce(fn) {
  let used = false;
  let result;
  return (...args) => {
    if (!used) {
      used = true;
      result = fn(...args);
    }

    return result;
  };
}

function getLocationOrigin() {
  const {
    protocol,
    hostname,
    port
  } = window.location;
  return `${protocol}//${hostname}${port ? ':' + port : ''}`;
}

function getURL() {
  const {
    href
  } = window.location;
  const origin = getLocationOrigin();
  return href.substring(origin.length);
}

function getDisplayName(Component) {
  return typeof Component === 'string' ? Component : Component.displayName || Component.name || 'Unknown';
}

function isResSent(res) {
  return res.finished || res.headersSent;
}

async function loadGetInitialProps(App, ctx) {
  if (true) {
    var _App$prototype;

    if ((_App$prototype = App.prototype) != null && _App$prototype.getInitialProps) {
      const message = `"${getDisplayName(App)}.getInitialProps()" is defined as an instance method - visit https://nextjs.org/docs/messages/get-initial-props-as-an-instance-method for more information.`;
      throw new Error(message);
    }
  } // when called from _app `ctx` is nested in `ctx`


  const res = ctx.res || ctx.ctx && ctx.ctx.res;

  if (!App.getInitialProps) {
    if (ctx.ctx && ctx.Component) {
      // @ts-ignore pageProps default
      return {
        pageProps: await loadGetInitialProps(ctx.Component, ctx.ctx)
      };
    }

    return {};
  }

  const props = await App.getInitialProps(ctx);

  if (res && isResSent(res)) {
    return props;
  }

  if (!props) {
    const message = `"${getDisplayName(App)}.getInitialProps()" should resolve to an object. But found "${props}" instead.`;
    throw new Error(message);
  }

  if (true) {
    if (Object.keys(props).length === 0 && !ctx.ctx) {
      console.warn(`${getDisplayName(App)} returned an empty object from \`getInitialProps\`. This de-optimizes and prevents automatic static optimization. https://nextjs.org/docs/messages/empty-object-getInitialProps`);
    }
  }

  return props;
}

const urlObjectKeys = ['auth', 'hash', 'host', 'hostname', 'href', 'path', 'pathname', 'port', 'protocol', 'query', 'search', 'slashes'];
exports.urlObjectKeys = urlObjectKeys;

function formatWithValidation(url) {
  if (true) {
    if (url !== null && typeof url === 'object') {
      Object.keys(url).forEach(key => {
        if (urlObjectKeys.indexOf(key) === -1) {
          console.warn(`Unknown key passed via urlObject into url.format: ${key}`);
        }
      });
    }
  }

  return (0, _formatUrl.formatUrl)(url);
}

const SP = typeof performance !== 'undefined';
exports.SP = SP;
const ST = SP && typeof performance.mark === 'function' && typeof performance.measure === 'function';
exports.ST = ST;

/***/ }),

/***/ "./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ MyApp; }
/* harmony export */ });
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _src_Context_context__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/Context/context */ "./src/Context/context.js");
/* harmony import */ var _src_Context_context__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_src_Context_context__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../styles/globals.css */ "./styles/globals.css");
/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! prop-types */ "prop-types");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_query__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-query */ "react-query");
/* harmony import */ var react_query__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_query__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _src_Global_Header_HeaderWrapper_HeaderWrapper__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../src/Global/Header/HeaderWrapper/HeaderWrapper */ "./src/Global/Header/HeaderWrapper/HeaderWrapper.js");
/* harmony import */ var _src_Global_Navigation_NavigationWrapper_NavigationWrapper__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../src/Global/Navigation/NavigationWrapper/NavigationWrapper */ "./src/Global/Navigation/NavigationWrapper/NavigationWrapper.js");

var _jsxFileName = "C:\\Users\\ASUS\\Dropbox\\My PC (DESKTOP-K2J5ET9)\\Desktop\\semiblog\\repo\\pages\\_app.js";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }








function MyApp({
  Component,
  pageProps
}) {
  (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');

    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  const queryClient = new react_query__WEBPACK_IMPORTED_MODULE_5__.QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnmount: false,
        refetchOnReconnect: false,
        retry: false
      }
    }
  });
  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_query__WEBPACK_IMPORTED_MODULE_5__.QueryClientProvider, {
    client: queryClient,
    children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_src_Context_context__WEBPACK_IMPORTED_MODULE_1__.AppWrapper, {
      children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_src_Global_Header_HeaderWrapper_HeaderWrapper__WEBPACK_IMPORTED_MODULE_6__.default, {}, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 34,
        columnNumber: 9
      }, this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_src_Global_Navigation_NavigationWrapper_NavigationWrapper__WEBPACK_IMPORTED_MODULE_7__.default, {}, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 35,
        columnNumber: 9
      }, this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, _objectSpread({}, pageProps), void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 36,
        columnNumber: 9
      }, this)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 33,
      columnNumber: 7
    }, this)
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 32,
    columnNumber: 5
  }, this);
}
MyApp.propTypes = {
  Component: (prop_types__WEBPACK_IMPORTED_MODULE_4___default().elementType.isRequired),
  pageProps: (prop_types__WEBPACK_IMPORTED_MODULE_4___default().object.isRequired)
};

/***/ }),

/***/ "./src/BASE_URL/baseUrl.js":
/*!*********************************!*\
  !*** ./src/BASE_URL/baseUrl.js ***!
  \*********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BASE_URL": function() { return /* binding */ BASE_URL; },
/* harmony export */   "BASE_VIDEO_URL": function() { return /* binding */ BASE_VIDEO_URL; },
/* harmony export */   "BASE_IMAGE_URL": function() { return /* binding */ BASE_IMAGE_URL; },
/* harmony export */   "BASE_FILE_URL": function() { return /* binding */ BASE_FILE_URL; }
/* harmony export */ });
const BASE_URL = 'https://iranchemi.com';
const BASE_VIDEO_URL = 'xxxxx';
const BASE_IMAGE_URL = 'yyyyy';
const BASE_FILE_URL = 'zzzzz';

/***/ }),

/***/ "./src/Context/context.js":
/*!********************************!*\
  !*** ./src/Context/context.js ***!
  \********************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var _jsxDevRuntime = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");

var _react = __webpack_require__(/*! react */ "react");

var _baseUrl = __webpack_require__(/*! ../BASE_URL/baseUrl */ "./src/BASE_URL/baseUrl.js");

var _cityReducer = __webpack_require__(/*! ./reducer/cityReducer */ "./src/Context/reducer/cityReducer.js");

var _userReducer = __webpack_require__(/*! ./reducer/userReducer */ "./src/Context/reducer/userReducer.js");

var _jsxFileName = "C:\\Users\\ASUS\\Dropbox\\My PC (DESKTOP-K2J5ET9)\\Desktop\\semiblog\\repo\\src\\Context\\context.js";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const AppContext = /*#__PURE__*/(0, _react.createContext)();

const AppWrapper = ({
  children
}) => {
  const {
    0: user,
    1: dispatch
  } = (0, _react.useReducer)(_userReducer.userReducer, _userReducer.userInitState);
  const {
    0: cities,
    1: setCities
  } = (0, _react.useReducer)(_cityReducer.cityReducer, _cityReducer.cityInitState);
  (0, _react.useEffect)(async () => {
    let controller = new AbortController();

    async function getUserData() {
      const userData = await fetch(`${_baseUrl.BASE_URL}/api/user/info`, {
        credentials: 'include',
        signal: controller.signal
      });

      if (userData.status == 200) {
        const {
          user,
          role,
          mongoId
        } = await userData.json();
        dispatch({
          type: 'change',
          payload: _objectSpread(_objectSpread({}, user), {}, {
            role: role.role,
            roleType: role.roleType,
            mongoId
          })
        });
      }
    }

    getUserData();
    return () => controller.abort();
  }, []);
  return /*#__PURE__*/(0, _jsxDevRuntime.jsxDEV)(AppContext.Provider, {
    value: {
      user,
      changer: dispatch,
      cities,
      dispatchCity: setCities
    },
    children: children
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 42,
    columnNumber: 5
  }, void 0);
};

const UseAppContext = () => {
  return (0, _react.useContext)(AppContext);
};

module.exports = {
  AppWrapper,
  UseAppContext
};

/***/ }),

/***/ "./src/Context/reducer/cityReducer.js":
/*!********************************************!*\
  !*** ./src/Context/reducer/cityReducer.js ***!
  \********************************************/
/***/ (function(module) {

const cityInitState = [];

const cityReducer = (state, action) => {
  switch (action.type) {
    case 'addCity':
      {
        let newState = state.concat({
          city: action.payload.city,
          id: action.payload.id
        });
        return newState;
      }

    case 'removeCity':
      {
        let newState = state.filter(itm => {
          return itm.id !== action.payload.id;
        });
        return newState;
      }

    default:
      return state;
  }
};

module.exports = {
  cityReducer,
  cityInitState
};

/***/ }),

/***/ "./src/Context/reducer/userReducer.js":
/*!********************************************!*\
  !*** ./src/Context/reducer/userReducer.js ***!
  \********************************************/
/***/ (function(module) {

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const userInitState = {
  username: '',
  avatar: '',
  role: '',
  roleType: '',
  userType: '',
  isRestricted: '',
  emailVerified: '',
  mobileVerified: '',
  id: '',
  mobile: '',
  email: '',
  mongoId: ''
};

const userReducer = (state, action) => {
  switch (action.type) {
    case 'change':
      return _objectSpread({}, action.payload);

    case 'sign':
      return _objectSpread(_objectSpread({}, state), {}, {
        username: action.payload.username,
        email: action.payload.email,
        mobile: action.payload.mobile
      });

    case 'verify':
      return _objectSpread(_objectSpread({}, state), {}, {
        emailVerified: action.payload.emailVerified,
        mobileVerified: action.payload.mobileVerified
      });

    default:
      return state;
  }
};

module.exports = {
  userReducer,
  userInitState
};

/***/ }),

/***/ "./src/Global/Header/BurgerMenu/BurgerMenu.js":
/*!****************************************************!*\
  !*** ./src/Global/Header/BurgerMenu/BurgerMenu.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _BurgerMenu_module_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./BurgerMenu.module.css */ "./src/Global/Header/BurgerMenu/BurgerMenu.module.css");
/* harmony import */ var _BurgerMenu_module_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_BurgerMenu_module_css__WEBPACK_IMPORTED_MODULE_2__);

var _jsxFileName = "C:\\Users\\ASUS\\Dropbox\\My PC (DESKTOP-K2J5ET9)\\Desktop\\semiblog\\repo\\src\\Global\\Header\\BurgerMenu\\BurgerMenu.js";



const BurgerMenu = ({
  setDropDownMenuHeight,
  setDropMenuContent,
  burgerStyle,
  setBurgerStyle
}) => {
  const changeBurgerMenuStyle = e => {
    if (burgerStyle === 'opened') {
      setDropDownMenuHeight('');
      setBurgerStyle('');
    } else {
      setDropMenuContent('menu');
      setBurgerStyle('opened');
      setDropDownMenuHeight('droppedMenuHeight');
    }
  };

  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
    className: "col-1 d-flex justify-content-center",
    children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("button", {
      className: `${(_BurgerMenu_module_css__WEBPACK_IMPORTED_MODULE_2___default().menu)} ${(_BurgerMenu_module_css__WEBPACK_IMPORTED_MODULE_2___default())[burgerStyle]}`,
      onClick: changeBurgerMenuStyle,
      children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("svg", {
        width: "40",
        height: "36",
        viewBox: "0 0 100 100",
        children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("path", {
          className: `${(_BurgerMenu_module_css__WEBPACK_IMPORTED_MODULE_2___default().line)} ${(_BurgerMenu_module_css__WEBPACK_IMPORTED_MODULE_2___default().line1)}`,
          d: "M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058"
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 28,
          columnNumber: 11
        }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("path", {
          className: `${(_BurgerMenu_module_css__WEBPACK_IMPORTED_MODULE_2___default().line)} ${(_BurgerMenu_module_css__WEBPACK_IMPORTED_MODULE_2___default().line2)}`,
          d: "M 20,50 H 80"
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 32,
          columnNumber: 11
        }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("path", {
          className: `${(_BurgerMenu_module_css__WEBPACK_IMPORTED_MODULE_2___default().line)} ${(_BurgerMenu_module_css__WEBPACK_IMPORTED_MODULE_2___default().line3)}`,
          d: "M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942"
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 33,
          columnNumber: 11
        }, undefined)]
      }, void 0, true, {
        fileName: _jsxFileName,
        lineNumber: 27,
        columnNumber: 9
      }, undefined)
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 23,
      columnNumber: 7
    }, undefined)
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 22,
    columnNumber: 5
  }, undefined);
};

/* harmony default export */ __webpack_exports__["default"] = (/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().memo(BurgerMenu));

/***/ }),

/***/ "./src/Global/Header/FAQIcon/FAQIcon.js":
/*!**********************************************!*\
  !*** ./src/Global/Header/FAQIcon/FAQIcon.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _FAQ_module_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FAQ.module.css */ "./src/Global/Header/FAQIcon/FAQ.module.css");
/* harmony import */ var _FAQ_module_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_FAQ_module_css__WEBPACK_IMPORTED_MODULE_1__);

var _jsxFileName = "C:\\Users\\ASUS\\Dropbox\\My PC (DESKTOP-K2J5ET9)\\Desktop\\semiblog\\repo\\src\\Global\\Header\\FAQIcon\\FAQIcon.js";


const FAQIcon = () => {
  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
    className: "col-1 d-flex justify-content-center",
    children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("button", {
      type: "button",
      className: `${(_FAQ_module_css__WEBPACK_IMPORTED_MODULE_1___default().Qbtn)}`,
      children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("i", {
        className: "fas fa-question",
        "aria-hidden": "true"
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 7,
        columnNumber: 9
      }, undefined)
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 6,
      columnNumber: 7
    }, undefined)
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 5,
    columnNumber: 5
  }, undefined);
};

/* harmony default export */ __webpack_exports__["default"] = (FAQIcon);

/***/ }),

/***/ "./src/Global/Header/HeaderDesktopView/HeaderDesktopView.js":
/*!******************************************************************!*\
  !*** ./src/Global/Header/HeaderDesktopView/HeaderDesktopView.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _SignUpSignIn_SignUpSignInButton_SignUpSignInButton__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../SignUpSignIn/SignUpSignInButton/SignUpSignInButton */ "./src/SignUpSignIn/SignUpSignInButton/SignUpSignInButton.js");
/* harmony import */ var _Icons_Icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Icons/Icons */ "./src/Global/Header/Icons/Icons.js");
/* harmony import */ var _Logo_Logo__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Logo/Logo */ "./src/Global/Header/Logo/Logo.js");
/* harmony import */ var _Overlay_Overlay__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Overlay/Overlay */ "./src/Global/Header/Overlay/Overlay.js");
/* harmony import */ var _PageLinks_PageLinks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../PageLinks/PageLinks */ "./src/Global/Header/PageLinks/PageLinks.js");
/* harmony import */ var _SearchBar_SearchBar__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../SearchBar/SearchBar */ "./src/Global/Header/SearchBar/SearchBar.js");
/* harmony import */ var _User_User__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../User/User */ "./src/Global/Header/User/User.js");
/* harmony import */ var _public_logo_png__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../public/logo.png */ "./public/logo.png");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _My_MyWrapper_MyWrapper__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../My/MyWrapper/MyWrapper */ "./src/Global/Header/My/MyWrapper/MyWrapper.js");
/* harmony import */ var _searchBarResult_SearchBarResult__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../searchBarResult/SearchBarResult */ "./src/Global/Header/searchBarResult/SearchBarResult.js");

var _jsxFileName = "C:\\Users\\ASUS\\Dropbox\\My PC (DESKTOP-K2J5ET9)\\Desktop\\semiblog\\repo\\src\\Global\\Header\\HeaderDesktopView\\HeaderDesktopView.js";












const HeaderDesktopView = ({
  searchBarAndLinksWrapper,
  user,
  setUserSearch,
  userSearch
}) => {
  const {
    0: showStyle,
    1: setShowStyle
  } = (0,react__WEBPACK_IMPORTED_MODULE_9__.useState)('');
  (0,react__WEBPACK_IMPORTED_MODULE_9__.useEffect)(() => {
    function removeOverlay(e) {
      let target = e.target.closest('#searchBarOverLay');

      if (!target) {
        setShowStyle('');
        setUserSearch([]);
      }

      return;
    }

    if (showStyle !== '') {
      document.addEventListener('click', removeOverlay);
    }

    return () => document.removeEventListener('click', removeOverlay);
  }, [showStyle]);
  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
    className: "container-fluid justify-content-around d-none d-lg-flex",
    children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
      className: "col-2",
      children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_Logo_Logo__WEBPACK_IMPORTED_MODULE_3__.default, {
        width: 77,
        height: 97,
        logo: _public_logo_png__WEBPACK_IMPORTED_MODULE_8__.default
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 41,
        columnNumber: 9
      }, undefined)
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 40,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
      className: `col-4 ${searchBarAndLinksWrapper}`,
      children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_SearchBar_SearchBar__WEBPACK_IMPORTED_MODULE_6__.default, {
        setShowStyle: setShowStyle,
        desktop: true,
        setUserSearch: setUserSearch
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 44,
        columnNumber: 9
      }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_PageLinks_PageLinks__WEBPACK_IMPORTED_MODULE_5__.default, {
        cls: "navbar-nav row row-cols-3 d-flex",
        navLiClass: "headerLink"
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 49,
        columnNumber: 9
      }, undefined)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 43,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_Icons_Icons__WEBPACK_IMPORTED_MODULE_2__.default, {
      iconStyle: "headerIconsWrapper"
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 54,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_My_MyWrapper_MyWrapper__WEBPACK_IMPORTED_MODULE_10__.default, {
      myStyle: "col-md-3 d-flex flex-column align-items-end"
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 55,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
      className: "col-1",
      children: user !== null && user !== void 0 && user.username && (user !== null && user !== void 0 && user.emailVerified || user !== null && user !== void 0 && user.mobileVerified) ? /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_User_User__WEBPACK_IMPORTED_MODULE_7__.default, {
        userInfoClass: "userInfoHeader",
        user: user
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 58,
        columnNumber: 11
      }, undefined) : /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_SignUpSignIn_SignUpSignInButton_SignUpSignInButton__WEBPACK_IMPORTED_MODULE_1__.default, {
        desktopSize: true
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 60,
        columnNumber: 11
      }, undefined)
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 56,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_Overlay_Overlay__WEBPACK_IMPORTED_MODULE_4__.default, {
      showStyle: showStyle,
      overLayStyle: "searchBarOverLayResults",
      children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_searchBarResult_SearchBarResult__WEBPACK_IMPORTED_MODULE_11__.default, {
        searchBarClass: "list-group list-group-flush w-50",
        userSearch: userSearch
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 64,
        columnNumber: 9
      }, undefined)
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 63,
      columnNumber: 7
    }, undefined)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 39,
    columnNumber: 5
  }, undefined);
};

/* harmony default export */ __webpack_exports__["default"] = (HeaderDesktopView);

/***/ }),

/***/ "./src/Global/Header/HeaderMobile/HeaderMobile.js":
/*!********************************************************!*\
  !*** ./src/Global/Header/HeaderMobile/HeaderMobile.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _public_mobilelogo_png__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../public/mobilelogo.png */ "./public/mobilelogo.png");
/* harmony import */ var _Logo_Logo__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Logo/Logo */ "./src/Global/Header/Logo/Logo.js");
/* harmony import */ var _SignUpSignIn_SignUpSignInButton_SignUpSignInButton__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../SignUpSignIn/SignUpSignInButton/SignUpSignInButton */ "./src/SignUpSignIn/SignUpSignInButton/SignUpSignInButton.js");
/* harmony import */ var _User_User__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../User/User */ "./src/Global/Header/User/User.js");
/* harmony import */ var _SubHeader_SubHeader__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./SubHeader/SubHeader */ "./src/Global/Header/HeaderMobile/SubHeader/SubHeader.js");


var _jsxFileName = "C:\\Users\\ASUS\\Dropbox\\My PC (DESKTOP-K2J5ET9)\\Desktop\\semiblog\\repo\\src\\Global\\Header\\HeaderMobile\\HeaderMobile.js";






const HeaderMobile = ({
  user,
  setUserSearch,
  userSearch
}) => {
  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
      className: "d-lg-none d-flex container-fluid justify-content-around position-relative",
      children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
        className: "col-6",
        children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_Logo_Logo__WEBPACK_IMPORTED_MODULE_2__.default, {
          width: 54,
          height: 56,
          logo: _public_mobilelogo_png__WEBPACK_IMPORTED_MODULE_1__.default
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 12,
          columnNumber: 11
        }, undefined)
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 11,
        columnNumber: 9
      }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
        className: "col-6 d-flex flex-wrap justify-content-end",
        children: user !== null && user !== void 0 && user.username && (user !== null && user !== void 0 && user.emailVerified || user !== null && user !== void 0 && user.mobileVerified) ? /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_User_User__WEBPACK_IMPORTED_MODULE_4__.default, {
          userInfoClass: "userInfoHeaderMobile",
          user: user
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 16,
          columnNumber: 13
        }, undefined) : /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_SignUpSignIn_SignUpSignInButton_SignUpSignInButton__WEBPACK_IMPORTED_MODULE_3__.default, {}, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 18,
          columnNumber: 13
        }, undefined)
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 14,
        columnNumber: 9
      }, undefined)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 10,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_SubHeader_SubHeader__WEBPACK_IMPORTED_MODULE_5__.default, {
      setUserSearch: setUserSearch,
      userSearch: userSearch
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 22,
      columnNumber: 7
    }, undefined)]
  }, void 0, true);
};

/* harmony default export */ __webpack_exports__["default"] = (HeaderMobile);

/***/ }),

/***/ "./src/Global/Header/HeaderMobile/SubHeader/SubHeader.js":
/*!***************************************************************!*\
  !*** ./src/Global/Header/HeaderMobile/SubHeader/SubHeader.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _BurgerMenu_BurgerMenu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../BurgerMenu/BurgerMenu */ "./src/Global/Header/BurgerMenu/BurgerMenu.js");
/* harmony import */ var _PageLinks_PageLinks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../PageLinks/PageLinks */ "./src/Global/Header/PageLinks/PageLinks.js");
/* harmony import */ var _SearchBar_SearchBar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../SearchBar/SearchBar */ "./src/Global/Header/SearchBar/SearchBar.js");
/* harmony import */ var _SubHeader_module_css__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./SubHeader.module.css */ "./src/Global/Header/HeaderMobile/SubHeader/SubHeader.module.css");
/* harmony import */ var _SubHeader_module_css__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_SubHeader_module_css__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _My_MyWrapper_MyWrapper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../My/MyWrapper/MyWrapper */ "./src/Global/Header/My/MyWrapper/MyWrapper.js");
/* harmony import */ var _Icons_Icons__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../Icons/Icons */ "./src/Global/Header/Icons/Icons.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _searchBarResult_SearchBarResult__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../searchBarResult/SearchBarResult */ "./src/Global/Header/searchBarResult/SearchBarResult.js");
/* harmony import */ var _Overlay_Overlay__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../Overlay/Overlay */ "./src/Global/Header/Overlay/Overlay.js");
/* harmony import */ var _FAQIcon_FAQIcon__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../FAQIcon/FAQIcon */ "./src/Global/Header/FAQIcon/FAQIcon.js");


var _jsxFileName = "C:\\Users\\ASUS\\Dropbox\\My PC (DESKTOP-K2J5ET9)\\Desktop\\semiblog\\repo\\src\\Global\\Header\\HeaderMobile\\SubHeader\\SubHeader.js";











const SubHeader = ({
  userSearch,
  setUserSearch
}) => {
  const {
    0: dropDownMenuHeight,
    1: setDropDownMenuHeight
  } = (0,react__WEBPACK_IMPORTED_MODULE_6__.useState)('');
  const {
    0: dropMenuContent,
    1: setDropMenuContent
  } = (0,react__WEBPACK_IMPORTED_MODULE_6__.useState)('search');
  const {
    0: burgerStyle,
    1: setBurgerStyle
  } = (0,react__WEBPACK_IMPORTED_MODULE_6__.useState)('');
  let DropMenuContent = dropMenuContent === 'menu' ? /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_PageLinks_PageLinks__WEBPACK_IMPORTED_MODULE_2__.default, {
      cls: "nav flex-column my-1",
      navLiClass: "smallHeaderLink"
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 19,
      columnNumber: 9
    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_My_MyWrapper_MyWrapper__WEBPACK_IMPORTED_MODULE_4__.default, {
      myStyle: "my-2"
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 20,
      columnNumber: 9
    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_Icons_Icons__WEBPACK_IMPORTED_MODULE_5__.default, {
      iconStyle: "headerIconWrapperMobile"
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 21,
      columnNumber: 9
    }, undefined)]
  }, void 0, true) : dropMenuContent === 'search' ? /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_searchBarResult_SearchBarResult__WEBPACK_IMPORTED_MODULE_7__.default, {
    searchBarClass: "list-group list-group-flush",
    userSearch: userSearch
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 24,
    columnNumber: 7
  }, undefined) : /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
    children: "locationnn"
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 29,
    columnNumber: 7
  }, undefined);
  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
    className: `d-lg-none d-flex container-fluid justify-content-around mt-1 ${(_SubHeader_module_css__WEBPACK_IMPORTED_MODULE_10___default().subHeader)}`,
    children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_BurgerMenu_BurgerMenu__WEBPACK_IMPORTED_MODULE_1__.default, {
      setDropDownMenuHeight: setDropDownMenuHeight,
      setDropMenuContent: setDropMenuContent,
      burgerStyle: burgerStyle,
      setBurgerStyle: setBurgerStyle
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 36,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
      className: `col-8 d-flex flex-shrink-1 justify-content-between px-3 border-start border-end ${(_SubHeader_module_css__WEBPACK_IMPORTED_MODULE_10___default().midSubHeader)}`,
      children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_SearchBar_SearchBar__WEBPACK_IMPORTED_MODULE_3__.default, {
        setShowStyle: setDropDownMenuHeight,
        setDropMenuContent: setDropMenuContent,
        setBurgerStyle: setBurgerStyle,
        setUserSearch: setUserSearch
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 45,
        columnNumber: 9
      }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_Overlay_Overlay__WEBPACK_IMPORTED_MODULE_8__.default, {
        showStyle: dropDownMenuHeight,
        overLayStyle: "droppedMenu",
        children: DropMenuContent
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 51,
        columnNumber: 9
      }, undefined)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 42,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_FAQIcon_FAQIcon__WEBPACK_IMPORTED_MODULE_9__.default, {}, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 55,
      columnNumber: 7
    }, undefined)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 33,
    columnNumber: 5
  }, undefined);
};

/* harmony default export */ __webpack_exports__["default"] = (SubHeader);

/***/ }),

/***/ "./src/Global/Header/HeaderWrapper/HeaderWrapper.js":
/*!**********************************************************!*\
  !*** ./src/Global/Header/HeaderWrapper/HeaderWrapper.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _HeaderWrapper_module_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./HeaderWrapper.module.css */ "./src/Global/Header/HeaderWrapper/HeaderWrapper.module.css");
/* harmony import */ var _HeaderWrapper_module_css__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_HeaderWrapper_module_css__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _Context_context__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../Context/context */ "./src/Context/context.js");
/* harmony import */ var _Context_context__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_Context_context__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _HeaderDesktopView_HeaderDesktopView__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../HeaderDesktopView/HeaderDesktopView */ "./src/Global/Header/HeaderDesktopView/HeaderDesktopView.js");
/* harmony import */ var _HeaderMobile_HeaderMobile__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../HeaderMobile/HeaderMobile */ "./src/Global/Header/HeaderMobile/HeaderMobile.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_4__);


var _jsxFileName = "C:\\Users\\ASUS\\Dropbox\\My PC (DESKTOP-K2J5ET9)\\Desktop\\semiblog\\repo\\src\\Global\\Header\\HeaderWrapper\\HeaderWrapper.js";






const HeaderWrapper = () => {
  const {
    user
  } = (0,_Context_context__WEBPACK_IMPORTED_MODULE_1__.UseAppContext)();
  const {
    0: userSearch,
    1: setUserSearch
  } = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)({});
  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("nav", {
      className: `navbar navbar-expand-lg navbar-white bg-white px-4 mb-2 ${(_HeaderWrapper_module_css__WEBPACK_IMPORTED_MODULE_5___default().navBar)}`,
      children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_HeaderDesktopView_HeaderDesktopView__WEBPACK_IMPORTED_MODULE_2__.default, {
        searchBarAndLinksWrapper: (_HeaderWrapper_module_css__WEBPACK_IMPORTED_MODULE_5___default().searchBarAndLinksWrapper),
        user: user,
        userSearch: userSearch,
        setUserSearch: setUserSearch
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 17,
        columnNumber: 9
      }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_HeaderMobile_HeaderMobile__WEBPACK_IMPORTED_MODULE_3__.default, {
        user: user,
        userSearch: userSearch,
        setUserSearch: setUserSearch
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 23,
        columnNumber: 9
      }, undefined)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 14,
      columnNumber: 7
    }, undefined)
  }, void 0, false);
};

/* harmony default export */ __webpack_exports__["default"] = (HeaderWrapper);

/***/ }),

/***/ "./src/Global/Header/Icons/Icons.js":
/*!******************************************!*\
  !*** ./src/Global/Header/Icons/Icons.js ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Icons_module_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Icons.module.css */ "./src/Global/Header/Icons/Icons.module.css");
/* harmony import */ var _Icons_module_css__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_Icons_module_css__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/link */ "./node_modules/next/link.js");
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_query__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-query */ "react-query");
/* harmony import */ var react_query__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_query__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Util_GET_getRequest__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../Util/GET/getRequest */ "./src/Util/GET/getRequest.js");
/* harmony import */ var _Util_GET_getRequest__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_Util_GET_getRequest__WEBPACK_IMPORTED_MODULE_3__);

var _jsxFileName = "C:\\Users\\ASUS\\Dropbox\\My PC (DESKTOP-K2J5ET9)\\Desktop\\semiblog\\repo\\src\\Global\\Header\\Icons\\Icons.js";





const HeaderIcons = ({
  iconStyle
}) => {
  const {
    data: unreadMsgCount
  } = (0,react_query__WEBPACK_IMPORTED_MODULE_2__.useQuery)('unreadMessageCount', _Util_GET_getRequest__WEBPACK_IMPORTED_MODULE_3___default()('/api/unread/message/count'));
  const {
    data: unreadNotifications
  } = (0,react_query__WEBPACK_IMPORTED_MODULE_2__.useQuery)('unreadNotificationCount', _Util_GET_getRequest__WEBPACK_IMPORTED_MODULE_3___default()('/api/notifications/count'));
  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
    className: `${(_Icons_module_css__WEBPACK_IMPORTED_MODULE_4___default())[iconStyle]} row col-1 justify-content-between`,
    children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
      className: "col-3 text-center",
      children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("span", {
        className: `${(_Icons_module_css__WEBPACK_IMPORTED_MODULE_4___default().userBadge)} badge badge-pill bg-success text-white`,
        children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("small", {
          children: unreadNotifications && unreadNotifications.total
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 23,
          columnNumber: 11
        }, undefined)
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 20,
        columnNumber: 9
      }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_1___default()), {
        href: "#",
        children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("a", {
          children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("i", {
            className: `far fa-bell ${(_Icons_module_css__WEBPACK_IMPORTED_MODULE_4___default().full)}`,
            "aria-hidden": "true"
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 27,
            columnNumber: 13
          }, undefined)
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 26,
          columnNumber: 11
        }, undefined)
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 25,
        columnNumber: 9
      }, undefined)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 19,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
      className: "col-3 text-center",
      children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("span", {
        className: `${(_Icons_module_css__WEBPACK_IMPORTED_MODULE_4___default().userBadge)} badge badge-pill bg-info text-white`,
        children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("small", {
          children: unreadMsgCount && unreadMsgCount.unreadMessagesCount
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 35,
          columnNumber: 11
        }, undefined)
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 32,
        columnNumber: 9
      }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_1___default()), {
        href: "#",
        children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("a", {
          children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("i", {
            className: "far fa-comment-dots",
            "aria-hidden": "true"
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 39,
            columnNumber: 13
          }, undefined)
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 38,
          columnNumber: 11
        }, undefined)
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 37,
        columnNumber: 9
      }, undefined)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 31,
      columnNumber: 7
    }, undefined)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 18,
    columnNumber: 5
  }, undefined);
};

/* harmony default export */ __webpack_exports__["default"] = (HeaderIcons);

/***/ }),

/***/ "./src/Global/Header/Logo/Logo.js":
/*!****************************************!*\
  !*** ./src/Global/Header/Logo/Logo.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/image */ "./node_modules/next/image.js");
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_image__WEBPACK_IMPORTED_MODULE_1__);

var _jsxFileName = "C:\\Users\\ASUS\\Dropbox\\My PC (DESKTOP-K2J5ET9)\\Desktop\\semiblog\\repo\\src\\Global\\Header\\Logo\\Logo.js";


const Logo = ({
  logo,
  width,
  height
}) => {
  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("a", {
    className: "navbar-brand",
    href: "#",
    children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_image__WEBPACK_IMPORTED_MODULE_1___default()), {
      src: logo,
      alt: "\u0628\u06CC\u0644\u0628\u0648\u0631\u062F",
      className: "d-inline-block align-text-top",
      width: width,
      height: height
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 6,
      columnNumber: 7
    }, undefined)
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 5,
    columnNumber: 5
  }, undefined);
};

/* harmony default export */ __webpack_exports__["default"] = (Logo);

/***/ }),

/***/ "./src/Global/Header/My/My.js":
/*!************************************!*\
  !*** ./src/Global/Header/My/My.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Util_ChangeDisplayFormat_IntToString__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../Util/ChangeDisplayFormat/IntToString */ "./src/Util/ChangeDisplayFormat/IntToString.js");
/* harmony import */ var _My_module_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./My.module.css */ "./src/Global/Header/My/My.module.css");
/* harmony import */ var _My_module_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_My_module_css__WEBPACK_IMPORTED_MODULE_2__);

var _jsxFileName = "C:\\Users\\ASUS\\Dropbox\\My PC (DESKTOP-K2J5ET9)\\Desktop\\semiblog\\repo\\src\\Global\\Header\\My\\My.js";



const My = ({
  children,
  credit,
  entity
}) => {
  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
    className: `input-group input-group-sm mb-1 w-75 ${(_My_module_css__WEBPACK_IMPORTED_MODULE_2___default().my)}`,
    children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("span", {
      className: "input-group-text",
      children: children
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 7,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("input", {
      type: "text",
      className: "form-control bg-white shadow-none text-center",
      placeholder: (0,_Util_ChangeDisplayFormat_IntToString__WEBPACK_IMPORTED_MODULE_1__.default)(entity),
      readOnly: true
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 8,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("span", {
      className: "input-group-text d-flex justify-content-center",
      children: credit
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 14,
      columnNumber: 7
    }, undefined)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 6,
    columnNumber: 5
  }, undefined);
};

/* harmony default export */ __webpack_exports__["default"] = (My);

/***/ }),

/***/ "./src/Global/Header/My/MyWrapper/MyWrapper.js":
/*!*****************************************************!*\
  !*** ./src/Global/Header/My/MyWrapper/MyWrapper.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _My__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../My */ "./src/Global/Header/My/My.js");

var _jsxFileName = "C:\\Users\\ASUS\\Dropbox\\My PC (DESKTOP-K2J5ET9)\\Desktop\\semiblog\\repo\\src\\Global\\Header\\My\\MyWrapper\\MyWrapper.js";


const MyWrapper = ({
  myStyle
}) => {
  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
    className: myStyle,
    children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_My__WEBPACK_IMPORTED_MODULE_1__.default, {
      credit: "BIL",
      entity: 230504501,
      children: "\u0627\u0645\u062A\u06CC\u0627\u0632"
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 6,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_My__WEBPACK_IMPORTED_MODULE_1__.default, {
      credit: "T",
      entity: 540023,
      children: "\u0645\u0648\u062C\u0648\u062F\u06CC"
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 9,
      columnNumber: 7
    }, undefined)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 5,
    columnNumber: 5
  }, undefined);
};

/* harmony default export */ __webpack_exports__["default"] = (MyWrapper);

/***/ }),

/***/ "./src/Global/Header/Overlay/Overlay.js":
/*!**********************************************!*\
  !*** ./src/Global/Header/Overlay/Overlay.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Overlay_module_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Overlay.module.css */ "./src/Global/Header/Overlay/Overlay.module.css");
/* harmony import */ var _Overlay_module_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_Overlay_module_css__WEBPACK_IMPORTED_MODULE_1__);

var _jsxFileName = "C:\\Users\\ASUS\\Dropbox\\My PC (DESKTOP-K2J5ET9)\\Desktop\\semiblog\\repo\\src\\Global\\Header\\Overlay\\Overlay.js";


const OverLay = ({
  showStyle,
  children,
  overLayStyle
}) => {
  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
    className: `${(_Overlay_module_css__WEBPACK_IMPORTED_MODULE_1___default())[overLayStyle]} ${(_Overlay_module_css__WEBPACK_IMPORTED_MODULE_1___default())[showStyle]}`,
    children: children
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 5,
    columnNumber: 5
  }, undefined);
};

/* harmony default export */ __webpack_exports__["default"] = (OverLay);

/***/ }),

/***/ "./src/Global/Header/PageLinks/HeaderLink/HeaderLink.js":
/*!**************************************************************!*\
  !*** ./src/Global/Header/PageLinks/HeaderLink/HeaderLink.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/link */ "./node_modules/next/link.js");
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/image */ "./node_modules/next/image.js");
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_image__WEBPACK_IMPORTED_MODULE_2__);

var _jsxFileName = "C:\\Users\\ASUS\\Dropbox\\My PC (DESKTOP-K2J5ET9)\\Desktop\\semiblog\\repo\\src\\Global\\Header\\PageLinks\\HeaderLink\\HeaderLink.js";




const HeaderLink = ({
  linkTo,
  content,
  icon,
  navLiClass
}) => {
  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("li", {
    className: `nav-item d-flex flex-row justify-content-center`,
    children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_image__WEBPACK_IMPORTED_MODULE_2___default()), {
      src: icon,
      width: 18,
      height: 18
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 8,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_1___default()), {
      href: `${linkTo}`,
      children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("a", {
        className: "nav-link",
        children: content
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 10,
        columnNumber: 9
      }, undefined)
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 9,
      columnNumber: 7
    }, undefined)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 7,
    columnNumber: 5
  }, undefined);
};

/* harmony default export */ __webpack_exports__["default"] = (HeaderLink);

/***/ }),

/***/ "./src/Global/Header/PageLinks/PageLinks.js":
/*!**************************************************!*\
  !*** ./src/Global/Header/PageLinks/PageLinks.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _HeaderLink_HeaderLink__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./HeaderLink/HeaderLink */ "./src/Global/Header/PageLinks/HeaderLink/HeaderLink.js");
/* harmony import */ var _public_info_svg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../public/info.svg */ "./public/info.svg");
/* harmony import */ var _public_ad_svg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../public/ad.svg */ "./public/ad.svg");
/* harmony import */ var _public_blog_svg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../public/blog.svg */ "./public/blog.svg");
/* harmony import */ var _HeaderLink_HeaderLink_module_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./HeaderLink/HeaderLink.module.css */ "./src/Global/Header/PageLinks/HeaderLink/HeaderLink.module.css");
/* harmony import */ var _HeaderLink_HeaderLink_module_css__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_HeaderLink_HeaderLink_module_css__WEBPACK_IMPORTED_MODULE_5__);

var _jsxFileName = "C:\\Users\\ASUS\\Dropbox\\My PC (DESKTOP-K2J5ET9)\\Desktop\\semiblog\\repo\\src\\Global\\Header\\PageLinks\\PageLinks.js";






const PageLinks = ({
  cls,
  navLiClass
}) => {
  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("ul", {
    className: `${cls} ${(_HeaderLink_HeaderLink_module_css__WEBPACK_IMPORTED_MODULE_5___default())[navLiClass]}`,
    children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_HeaderLink_HeaderLink__WEBPACK_IMPORTED_MODULE_1__.default, {
      linkTo: "/Chat",
      content: "\u0622\u06AF\u0647\u06CC",
      icon: _public_ad_svg__WEBPACK_IMPORTED_MODULE_3__.default
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 10,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_HeaderLink_HeaderLink__WEBPACK_IMPORTED_MODULE_1__.default, {
      linkTo: "/",
      content: "\u0628\u0627\u0646\u06A9 \u0627\u0637\u0644\u0627\u0639\u0627\u062A",
      icon: _public_info_svg__WEBPACK_IMPORTED_MODULE_2__.default
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 11,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_HeaderLink_HeaderLink__WEBPACK_IMPORTED_MODULE_1__.default, {
      linkTo: "#",
      content: "\u0628\u0644\u0627\u06AF",
      icon: _public_blog_svg__WEBPACK_IMPORTED_MODULE_4__.default
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 12,
      columnNumber: 7
    }, undefined)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 9,
    columnNumber: 5
  }, undefined);
};

/* harmony default export */ __webpack_exports__["default"] = (PageLinks);

/***/ }),

/***/ "./src/Global/Header/SearchBar/SearchBar.js":
/*!**************************************************!*\
  !*** ./src/Global/Header/SearchBar/SearchBar.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _BASE_URL_baseUrl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../BASE_URL/baseUrl */ "./src/BASE_URL/baseUrl.js");
/* harmony import */ var _SearchBar_module_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SearchBar.module.css */ "./src/Global/Header/SearchBar/SearchBar.module.css");
/* harmony import */ var _SearchBar_module_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_SearchBar_module_css__WEBPACK_IMPORTED_MODULE_3__);

var _jsxFileName = "C:\\Users\\ASUS\\Dropbox\\My PC (DESKTOP-K2J5ET9)\\Desktop\\semiblog\\repo\\src\\Global\\Header\\SearchBar\\SearchBar.js";




const SearchBar = ({
  setShowStyle,
  desktop,
  setDropMenuContent,
  setBurgerStyle,
  setUserSearch
}) => {
  let timer;

  const searchHandler = e => {
    clearTimeout(timer);
    let text = e.target.value;

    if (text && text.trim()) {
      timer = setTimeout(async () => {
        const searchRes = await fetch(`${_BASE_URL_baseUrl__WEBPACK_IMPORTED_MODULE_2__.BASE_URL}/api/search/all?search=${text}`);

        if (searchRes.status === 200) {
          const searchResJson = await searchRes.json();
          setUserSearch(searchResJson);

          if (desktop) {
            setShowStyle('showStyle');
          } else {
            setDropMenuContent('search');
            setShowStyle(prvs => {
              if (prvs === '') {
                prvs = 'droppedMenuHeight';
                setBurgerStyle('opened');
                return prvs;
              } else {
                return prvs;
              }
            });
          }
        }
      }, 2000);
    } else {
      setUserSearch([]);
    }
  };

  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
    className: `input-group input-group-sm ${desktop ? (_SearchBar_module_css__WEBPACK_IMPORTED_MODULE_3___default().searchBar) : (_SearchBar_module_css__WEBPACK_IMPORTED_MODULE_3___default().smallSearchBar)}`,
    children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("span", {
      className: `input-group-text border-0 ${desktop ? (_SearchBar_module_css__WEBPACK_IMPORTED_MODULE_3___default().roundedIcon) : (_SearchBar_module_css__WEBPACK_IMPORTED_MODULE_3___default().smallRoundedIcon)}`,
      children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("i", {
        className: "fa fa-search",
        "aria-hidden": "true"
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 61,
        columnNumber: 9
      }, undefined)
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 56,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("input", {
      className: `form-control border-0 ${(_SearchBar_module_css__WEBPACK_IMPORTED_MODULE_3___default().roundedInput)}`,
      type: "text",
      placeholder: "\u062C\u0633\u062A\u062C\u0648 \u062F\u0631 \u0628\u06CC\u0644\u0628\u0648\u0631\u062F ...",
      onChange: searchHandler,
      defaultValue: ""
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 63,
      columnNumber: 7
    }, undefined)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 51,
    columnNumber: 5
  }, undefined);
};

/* harmony default export */ __webpack_exports__["default"] = (/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().memo(SearchBar));

/***/ }),

/***/ "./src/Global/Header/User/User.js":
/*!****************************************!*\
  !*** ./src/Global/Header/User/User.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/link */ "./node_modules/next/link.js");
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _User_module_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./User.module.css */ "./src/Global/Header/User/User.module.css");
/* harmony import */ var _User_module_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_User_module_css__WEBPACK_IMPORTED_MODULE_2__);

var _jsxFileName = "C:\\Users\\ASUS\\Dropbox\\My PC (DESKTOP-K2J5ET9)\\Desktop\\semiblog\\repo\\src\\Global\\Header\\User\\User.js";



const User = ({
  userInfoClass,
  user
}) => {
  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
    className: `${(_User_module_css__WEBPACK_IMPORTED_MODULE_2___default())[userInfoClass]}`,
    children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
      children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
        children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_1___default()), {
          href: "#",
          children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("a", {
            children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("img", {
              src: "data:image/png;base64,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",
              alt: "User"
            }, void 0, false, {
              fileName: _jsxFileName,
              lineNumber: 11,
              columnNumber: 15
            }, undefined)
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 10,
            columnNumber: 13
          }, undefined)
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 9,
          columnNumber: 11
        }, undefined)
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 8,
        columnNumber: 9
      }, undefined)
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 7,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("span", {
      children: user && user.username
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 19,
      columnNumber: 7
    }, undefined)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 6,
    columnNumber: 5
  }, undefined);
};

/* harmony default export */ __webpack_exports__["default"] = (User);

/***/ }),

/***/ "./src/Global/Header/searchBarResult/Results/Results.js":
/*!**************************************************************!*\
  !*** ./src/Global/Header/searchBarResult/Results/Results.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Results_module_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Results.module.css */ "./src/Global/Header/searchBarResult/Results/Results.module.css");
/* harmony import */ var _Results_module_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_Results_module_css__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/link */ "./node_modules/next/link.js");
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _SearchResultStar_SearchResultStar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../SearchResultStar/SearchResultStar */ "./src/Global/Header/searchBarResult/SearchResultStar/SearchResultStar.js");


var _jsxFileName = "C:\\Users\\ASUS\\Dropbox\\My PC (DESKTOP-K2J5ET9)\\Desktop\\semiblog\\repo\\src\\Global\\Header\\searchBarResult\\Results\\Results.js";




const Results = ({
  results,
  type,
  searchBarClass
}) => {
  let content = type === 'ad' ? 'آگهی ها' : 'بانک اطلاعات';
  let result = results && results.map(itm => {
    let url = `${type}/${itm.id}`;
    return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("li", {
      className: "list-group-item",
      children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_SearchResultStar_SearchResultStar__WEBPACK_IMPORTED_MODULE_2__.default, {
        count: itm.adType
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 15,
        columnNumber: 11
      }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_1___default()), {
        href: "#",
        children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("a", {
          children: itm.title
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 17,
          columnNumber: 13
        }, undefined)
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 16,
        columnNumber: 11
      }, undefined)]
    }, itm.id, true, {
      fileName: _jsxFileName,
      lineNumber: 14,
      columnNumber: 9
    }, undefined);
  });
  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("h5", {
      className: `bg-white w-50 ${(_Results_module_css__WEBPACK_IMPORTED_MODULE_3___default().searchHeading)}`,
      children: ["\u0646\u062A\u06CC\u062C\u0647 \u062C\u0633\u062A\u062C\u0648 \u062F\u0631 ", content]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 25,
      columnNumber: 7
    }, undefined), results && results.length ? /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("ul", {
      className: `${searchBarClass} ${(_Results_module_css__WEBPACK_IMPORTED_MODULE_3___default().searchBarUl)}`,
      children: result
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 29,
      columnNumber: 9
    }, undefined) : /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("p", {
      className: "text-center bg-white w-50",
      style: {
        marginRight: '23%',
        marginBottom: '0',
        paddingBottom: '10px'
      },
      children: "\u0646\u062A\u06CC\u062C\u0647 \u0627\u06CC \u06CC\u0627\u0641\u062A \u0646\u0634\u062F"
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 31,
      columnNumber: 9
    }, undefined)]
  }, void 0, true);
};

/* harmony default export */ __webpack_exports__["default"] = (Results);

/***/ }),

/***/ "./src/Global/Header/searchBarResult/SearchBarResult.js":
/*!**************************************************************!*\
  !*** ./src/Global/Header/searchBarResult/SearchBarResult.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Results_Results__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Results/Results */ "./src/Global/Header/searchBarResult/Results/Results.js");

var _jsxFileName = "C:\\Users\\ASUS\\Dropbox\\My PC (DESKTOP-K2J5ET9)\\Desktop\\semiblog\\repo\\src\\Global\\Header\\searchBarResult\\SearchBarResult.js";


const SearchBarResult = ({
  userSearch,
  searchBarClass
}) => {
  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
    id: "searchBarOverLay",
    children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_Results_Results__WEBPACK_IMPORTED_MODULE_1__.default, {
      results: userSearch.ads,
      type: "ad",
      searchBarClass: searchBarClass
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 6,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_Results_Results__WEBPACK_IMPORTED_MODULE_1__.default, {
      results: userSearch.infoBanks,
      type: "bank-info",
      searchBarClass: searchBarClass
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 11,
      columnNumber: 7
    }, undefined)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 5,
    columnNumber: 5
  }, undefined);
};

/* harmony default export */ __webpack_exports__["default"] = (SearchBarResult);

/***/ }),

/***/ "./src/Global/Header/searchBarResult/SearchResultStar/SearchResultStar.js":
/*!********************************************************************************!*\
  !*** ./src/Global/Header/searchBarResult/SearchResultStar/SearchResultStar.js ***!
  \********************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);

var _jsxFileName = "C:\\Users\\ASUS\\Dropbox\\My PC (DESKTOP-K2J5ET9)\\Desktop\\semiblog\\repo\\src\\Global\\Header\\searchBarResult\\SearchResultStar\\SearchResultStar.js";

const SearchResultStar = ({
  count
}) => {
  let stars = [];

  for (let i = 0; i < count + 1; i++) {
    stars.push( /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("i", {
      className: "fa fa-star",
      style: {
        color: 'gold'
      },
      "aria-hidden": "true"
    }, i, false, {
      fileName: _jsxFileName,
      lineNumber: 6,
      columnNumber: 7
    }, undefined));
  }

  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("span", {
    style: {
      marginLeft: '11px'
    },
    children: stars
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 15,
    columnNumber: 10
  }, undefined);
};

/* harmony default export */ __webpack_exports__["default"] = (SearchResultStar);

/***/ }),

/***/ "./src/Global/Navigation/Location/CityList/CityList.js":
/*!*************************************************************!*\
  !*** ./src/Global/Navigation/Location/CityList/CityList.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _LocationMark_LocationMark__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../LocationMark/LocationMark */ "./src/Global/Navigation/Location/LocationMark/LocationMark.js");
/* harmony import */ var _LocationModal_LocationModal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../LocationModal/LocationModal */ "./src/Global/Navigation/Location/LocationModal/LocationModal.js");
/* harmony import */ var _CityList_module_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./CityList.module.css */ "./src/Global/Navigation/Location/CityList/CityList.module.css");
/* harmony import */ var _CityList_module_css__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_CityList_module_css__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _ItemCity__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ItemCity */ "./src/Global/Navigation/Location/CityList/ItemCity.js");

var _jsxFileName = "C:\\Users\\ASUS\\Dropbox\\My PC (DESKTOP-K2J5ET9)\\Desktop\\semiblog\\repo\\src\\Global\\Navigation\\Location\\CityList\\CityList.js";





const CityList = ({
  cities
}) => {
  let itemCities = cities && cities.length && cities.map(itm => {
    return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_ItemCity__WEBPACK_IMPORTED_MODULE_3__.default, {
      cityName: itm.city,
      cityId: itm.id
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 11,
      columnNumber: 14
    }, undefined);
  });
  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
    className: `dropdown d-flex ${(_CityList_module_css__WEBPACK_IMPORTED_MODULE_4___default().cityList)}`,
    children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_LocationMark_LocationMark__WEBPACK_IMPORTED_MODULE_1__.default, {
      text: false
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 16,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_LocationModal_LocationModal__WEBPACK_IMPORTED_MODULE_2__.default, {}, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 17,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("button", {
      className: "btn btn-white dropdown-toggle btn-sm ms-1",
      type: "button",
      id: "dropDownCities",
      "data-bs-toggle": "dropdown",
      "aria-expanded": "false",
      children: "\u0634\u0647\u0631 \u0647\u0627\u06CC \u0645\u0646\u062A\u062E\u0628"
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 18,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("ul", {
      className: "dropdown-menu shadow-sm ",
      "aria-labelledby": "dropDownCities",
      children: itemCities
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 27,
      columnNumber: 7
    }, undefined)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 15,
    columnNumber: 5
  }, undefined);
};

/* harmony default export */ __webpack_exports__["default"] = (CityList);

/***/ }),

/***/ "./src/Global/Navigation/Location/CityList/ItemCity.js":
/*!*************************************************************!*\
  !*** ./src/Global/Navigation/Location/CityList/ItemCity.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Context_context__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../Context/context */ "./src/Context/context.js");
/* harmony import */ var _Context_context__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_Context_context__WEBPACK_IMPORTED_MODULE_1__);

var _jsxFileName = "C:\\Users\\ASUS\\Dropbox\\My PC (DESKTOP-K2J5ET9)\\Desktop\\semiblog\\repo\\src\\Global\\Navigation\\Location\\CityList\\ItemCity.js";


const ItemCity = ({
  cityName,
  cityId
}) => {
  const {
    dispatchCity
  } = (0,_Context_context__WEBPACK_IMPORTED_MODULE_1__.UseAppContext)();

  const removeCity = e => {
    dispatchCity({
      type: 'removeCity',
      payload: {
        id: e.target.value
      }
    });
  };

  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("li", {
    className: "d-flex justify-content-between align-items-center",
    children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("span", {
      className: "dropdown-item",
      children: cityName
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 12,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("button", {
      type: "button",
      className: "btn-close btn-sm",
      "aria-label": "Close",
      value: cityId,
      onClick: e => removeCity(e)
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 13,
      columnNumber: 7
    }, undefined)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 11,
    columnNumber: 5
  }, undefined);
};

/* harmony default export */ __webpack_exports__["default"] = (ItemCity);

/***/ }),

/***/ "./src/Global/Navigation/Location/City/City.js":
/*!*****************************************************!*\
  !*** ./src/Global/Navigation/Location/City/City.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_query__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-query */ "react-query");
/* harmony import */ var react_query__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_query__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Util_GET_getRequest__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../Util/GET/getRequest */ "./src/Util/GET/getRequest.js");
/* harmony import */ var _Util_GET_getRequest__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_Util_GET_getRequest__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_loading__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-loading */ "react-loading");
/* harmony import */ var react_loading__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_loading__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _Context_context__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../Context/context */ "./src/Context/context.js");
/* harmony import */ var _Context_context__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_Context_context__WEBPACK_IMPORTED_MODULE_5__);

var _jsxFileName = "C:\\Users\\ASUS\\Dropbox\\My PC (DESKTOP-K2J5ET9)\\Desktop\\semiblog\\repo\\src\\Global\\Navigation\\Location\\City\\City.js";






const City = ({
  provinceId,
  setCity
}) => {
  const {
    isLoading,
    data
  } = (0,react_query__WEBPACK_IMPORTED_MODULE_1__.useQuery)(['cities', provinceId], _Util_GET_getRequest__WEBPACK_IMPORTED_MODULE_2___default()(`/api/province/get/${provinceId}`), {
    enabled: !!provinceId
  });
  const {
    cities
  } = (0,_Context_context__WEBPACK_IMPORTED_MODULE_5__.UseAppContext)();

  const addCity = e => {
    let selected = Array.from(e.target.options).filter(option => option.selected);
    setCity({
      city: selected[0].dataset.value,
      id: selected[0].value
    });
  };

  let optionCities = data && data.Cities && data.Cities.length && lodash__WEBPACK_IMPORTED_MODULE_4___default().xorBy(data.Cities, cities, 'id').map(itm => {
    return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("option", {
      value: itm.id,
      "data-value": itm.city,
      children: itm.city
    }, itm.id, false, {
      fileName: _jsxFileName,
      lineNumber: 32,
      columnNumber: 9
    }, undefined);
  });

  if (isLoading) {
    return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((react_loading__WEBPACK_IMPORTED_MODULE_3___default()), {
      type: "bubbles",
      color: "#6b6b6b",
      height: 40,
      width: 40
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 40,
      columnNumber: 7
    }, undefined);
  } else {
    return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("select", {
      className: "form-select",
      onChange: e => addCity(e),
      children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("option", {
        children: "\u0644\u0637\u0641\u0627 \u0634\u0647\u0631 \u0645\u0648\u0631\u062F \u0646\u0638\u0631 \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F"
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 45,
        columnNumber: 9
      }, undefined), optionCities]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 44,
      columnNumber: 7
    }, undefined);
  }
};

/* harmony default export */ __webpack_exports__["default"] = (City);

/***/ }),

/***/ "./src/Global/Navigation/Location/Location.js":
/*!****************************************************!*\
  !*** ./src/Global/Navigation/Location/Location.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _LocationMark_LocationMark__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./LocationMark/LocationMark */ "./src/Global/Navigation/Location/LocationMark/LocationMark.js");
/* harmony import */ var _Location_module_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Location.module.css */ "./src/Global/Navigation/Location/Location.module.css");
/* harmony import */ var _Location_module_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_Location_module_css__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _LocationModal_LocationModal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./LocationModal/LocationModal */ "./src/Global/Navigation/Location/LocationModal/LocationModal.js");

var _jsxFileName = "C:\\Users\\ASUS\\Dropbox\\My PC (DESKTOP-K2J5ET9)\\Desktop\\semiblog\\repo\\src\\Global\\Navigation\\Location\\Location.js";




const Location = () => {
  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
    className: `col-lg-6 col-1 d-flex justify-content-end ${(_Location_module_css__WEBPACK_IMPORTED_MODULE_3___default().location)}`,
    children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_LocationMark_LocationMark__WEBPACK_IMPORTED_MODULE_1__.default, {
      text: true
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 10,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_LocationModal_LocationModal__WEBPACK_IMPORTED_MODULE_2__.default, {}, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 11,
      columnNumber: 7
    }, undefined)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 7,
    columnNumber: 5
  }, undefined);
};

/* harmony default export */ __webpack_exports__["default"] = (Location);

/***/ }),

/***/ "./src/Global/Navigation/Location/LocationMark/LocationMark.js":
/*!*********************************************************************!*\
  !*** ./src/Global/Navigation/Location/LocationMark/LocationMark.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Context_context__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../Context/context */ "./src/Context/context.js");
/* harmony import */ var _Context_context__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_Context_context__WEBPACK_IMPORTED_MODULE_2__);

var _jsxFileName = "C:\\Users\\ASUS\\Dropbox\\My PC (DESKTOP-K2J5ET9)\\Desktop\\semiblog\\repo\\src\\Global\\Navigation\\Location\\LocationMark\\LocationMark.js";



const LocationMark = ({
  text
}) => {
  const {
    0: icon,
    1: setIcon
  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('fa fa-map-marker');
  const {
    cities
  } = (0,_Context_context__WEBPACK_IMPORTED_MODULE_2__.UseAppContext)();
  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    if (cities.length) {
      setIcon('fas fa-plus');
    } else {
      setIcon('fa fa-map-marker');
    }
  }, [cities]);
  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
    className: "d-flex",
    children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("button", {
      type: "button",
      "data-bs-toggle": "modal",
      "data-bs-target": "#locationModal",
      className: "bg-white",
      children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("i", {
        className: icon,
        "aria-hidden": "true"
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 25,
        columnNumber: 9
      }, undefined)
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 19,
      columnNumber: 7
    }, undefined), text && /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("p", {
      className: "d-none d-lg-block mb-0 ms-2",
      children: "\u0634\u0647\u0631 \u062E\u0648\u062F \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F"
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 28,
      columnNumber: 9
    }, undefined)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 18,
    columnNumber: 5
  }, undefined);
};

/* harmony default export */ __webpack_exports__["default"] = (LocationMark);

/***/ }),

/***/ "./src/Global/Navigation/Location/LocationModal/LocationModal.js":
/*!***********************************************************************!*\
  !*** ./src/Global/Navigation/Location/LocationModal/LocationModal.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _City_City__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../City/City */ "./src/Global/Navigation/Location/City/City.js");
/* harmony import */ var _Province_Province__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Province/Province */ "./src/Global/Navigation/Location/Province/Province.js");
/* harmony import */ var _Context_context__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../Context/context */ "./src/Context/context.js");
/* harmony import */ var _Context_context__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_Context_context__WEBPACK_IMPORTED_MODULE_4__);

var _jsxFileName = "C:\\Users\\ASUS\\Dropbox\\My PC (DESKTOP-K2J5ET9)\\Desktop\\semiblog\\repo\\src\\Global\\Navigation\\Location\\LocationModal\\LocationModal.js";





const LocationModal = () => {
  const {
    0: province,
    1: setProvince
  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
  const {
    0: city,
    1: setCity
  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
  const {
    dispatchCity
  } = (0,_Context_context__WEBPACK_IMPORTED_MODULE_4__.UseAppContext)();
  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    function remLoc(e) {
      let target = e.target.closest('#locationModal');

      if (!target) {
        setProvince(null);
        setCity(null);
      } else return;
    }

    document.addEventListener('click', remLoc);
    return () => document.removeEventListener('click', remLoc);
  }, []);

  const disposeModal = () => {
    dispatchCity({
      type: 'addCity',
      payload: {
        id: city.id,
        city: city.city
      }
    });
  };

  const refreshLoc = () => {
    setProvince(null);
    setCity(null);
  };

  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
    className: "modal fade",
    id: "locationModal",
    tabIndex: "-1",
    "aria-labelledby": "locationModalLabel",
    "aria-hidden": "true",
    children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
      className: "modal-dialog",
      children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
        className: "modal-content",
        children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
          className: "modal-header",
          children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("h5", {
            className: "modal-title",
            id: "locationModalLabel",
            children: "\u0627\u0646\u062A\u062E\u0627\u0628 \u0627\u0633\u062A\u0627\u0646 \u0648 \u0634\u0647\u0631"
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 50,
            columnNumber: 13
          }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("button", {
            type: "button",
            className: "btn-close",
            "data-bs-dismiss": "modal",
            "aria-label": "Close",
            onClick: refreshLoc
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 53,
            columnNumber: 13
          }, undefined)]
        }, void 0, true, {
          fileName: _jsxFileName,
          lineNumber: 49,
          columnNumber: 11
        }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
          className: "modal-body d-flex justify-content-center",
          children: province ? /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_City_City__WEBPACK_IMPORTED_MODULE_2__.default, {
            provinceId: province,
            setCity: setCity
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 63,
            columnNumber: 15
          }, undefined) : /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_Province_Province__WEBPACK_IMPORTED_MODULE_3__.default, {
            setProvince: setProvince
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 65,
            columnNumber: 15
          }, undefined)
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 61,
          columnNumber: 11
        }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
          className: "modal-footer",
          children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("button", {
            type: "button",
            className: "btn btn-primary",
            "data-bs-dismiss": "modal",
            onClick: disposeModal,
            disabled: province ? false : true,
            children: "\u062B\u0628\u062A"
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 69,
            columnNumber: 13
          }, undefined)
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 68,
          columnNumber: 11
        }, undefined)]
      }, void 0, true, {
        fileName: _jsxFileName,
        lineNumber: 48,
        columnNumber: 9
      }, undefined)
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 47,
      columnNumber: 7
    }, undefined)
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 40,
    columnNumber: 5
  }, undefined);
};

/* harmony default export */ __webpack_exports__["default"] = (LocationModal);

/***/ }),

/***/ "./src/Global/Navigation/Location/Province/Province.js":
/*!*************************************************************!*\
  !*** ./src/Global/Navigation/Location/Province/Province.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_query__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-query */ "react-query");
/* harmony import */ var react_query__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_query__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Util_GET_getRequest__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../Util/GET/getRequest */ "./src/Util/GET/getRequest.js");
/* harmony import */ var _Util_GET_getRequest__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_Util_GET_getRequest__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_loading__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-loading */ "react-loading");
/* harmony import */ var react_loading__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_loading__WEBPACK_IMPORTED_MODULE_3__);

var _jsxFileName = "C:\\Users\\ASUS\\Dropbox\\My PC (DESKTOP-K2J5ET9)\\Desktop\\semiblog\\repo\\src\\Global\\Navigation\\Location\\Province\\Province.js";




const Province = ({
  setProvince
}) => {
  const {
    isLoading,
    data
  } = (0,react_query__WEBPACK_IMPORTED_MODULE_1__.useQuery)('provinces', _Util_GET_getRequest__WEBPACK_IMPORTED_MODULE_2___default()('/api/province/getall'));

  const chooseProvince = e => {
    setProvince(e.target.value);
  };

  let provinces = data && data.length && data.map(itm => {
    return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("option", {
      value: itm.id,
      children: itm.province
    }, itm.id, false, {
      fileName: _jsxFileName,
      lineNumber: 20,
      columnNumber: 9
    }, undefined);
  });

  if (isLoading) {
    return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((react_loading__WEBPACK_IMPORTED_MODULE_3___default()), {
      type: "bubbles",
      color: "#6b6b6b",
      height: 40,
      width: 40
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 28,
      columnNumber: 7
    }, undefined);
  } else {
    return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("select", {
      className: "form-select",
      onChange: e => chooseProvince(e),
      children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("option", {
        children: "\u0644\u0637\u0641\u0627 \u0627\u0633\u062A\u0627\u0646 \u0645\u0648\u0631\u062F \u0646\u0638\u0631 \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F"
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 33,
        columnNumber: 9
      }, undefined), provinces]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 32,
      columnNumber: 7
    }, undefined);
  }
};

/* harmony default export */ __webpack_exports__["default"] = (Province);

/***/ }),

/***/ "./src/Global/Navigation/NavigationWrapper/NavigationWrapper.js":
/*!**********************************************************************!*\
  !*** ./src/Global/Navigation/NavigationWrapper/NavigationWrapper.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Location_Location__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Location/Location */ "./src/Global/Navigation/Location/Location.js");
/* harmony import */ var _Path_Path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Path/Path */ "./src/Global/Navigation/Path/Path.js");
/* harmony import */ var _Context_context__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../Context/context */ "./src/Context/context.js");
/* harmony import */ var _Context_context__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_Context_context__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _Location_CityList_CityList__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Location/CityList/CityList */ "./src/Global/Navigation/Location/CityList/CityList.js");

var _jsxFileName = "C:\\Users\\ASUS\\Dropbox\\My PC (DESKTOP-K2J5ET9)\\Desktop\\semiblog\\repo\\src\\Global\\Navigation\\NavigationWrapper\\NavigationWrapper.js";






const NavigationWrapper = () => {
  const {
    0: chooseCity,
    1: setChooseCity
  } = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)(false);
  const {
    cities
  } = (0,_Context_context__WEBPACK_IMPORTED_MODULE_3__.UseAppContext)();
  (0,react__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    if (cities.length) {
      setChooseCity(true);
    } else {
      setChooseCity(false);
    }
  }, [cities]);
  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
    className: "container-fluid px-5 mb-3",
    children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
      className: "bg-white rounded-pill d-flex px-3 justify-content-between align-items-center shadow-sm",
      children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_Path_Path__WEBPACK_IMPORTED_MODULE_2__.default, {}, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 22,
        columnNumber: 9
      }, undefined), chooseCity ? /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_Location_CityList_CityList__WEBPACK_IMPORTED_MODULE_5__.default, {
        cities: cities
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 23,
        columnNumber: 23
      }, undefined) : /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_Location_Location__WEBPACK_IMPORTED_MODULE_1__.default, {}, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 23,
        columnNumber: 54
      }, undefined)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 21,
      columnNumber: 7
    }, undefined)
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 20,
    columnNumber: 5
  }, undefined);
};

/* harmony default export */ __webpack_exports__["default"] = (NavigationWrapper);

/***/ }),

/***/ "./src/Global/Navigation/Path/Path.js":
/*!********************************************!*\
  !*** ./src/Global/Navigation/Path/Path.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var nextjs_breadcrumbs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! nextjs-breadcrumbs */ "nextjs-breadcrumbs");
/* harmony import */ var nextjs_breadcrumbs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(nextjs_breadcrumbs__WEBPACK_IMPORTED_MODULE_1__);

var _jsxFileName = "C:\\Users\\ASUS\\Dropbox\\My PC (DESKTOP-K2J5ET9)\\Desktop\\semiblog\\repo\\src\\Global\\Navigation\\Path\\Path.js";


const Path = () => {
  const changeLabel = title => {
    switch (title) {
      case 'Home':
        return 'خانه';

      case 'test':
        return 'تست';

      default:
        return title;
    }
  };

  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((nextjs_breadcrumbs__WEBPACK_IMPORTED_MODULE_1___default()), {
    rootLabel: "Home",
    transformLabel: changeLabel,
    listClassName: "breadcrumb m-0",
    inactiveItemClassName: "breadcrumb-item",
    activeItemClassName: "breadcrumb-item active"
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 17,
    columnNumber: 5
  }, undefined);
};

/* harmony default export */ __webpack_exports__["default"] = (Path);

/***/ }),

/***/ "./src/SignUpSignIn/SignUpSignInButton/SignUpSignInButton.js":
/*!*******************************************************************!*\
  !*** ./src/SignUpSignIn/SignUpSignInButton/SignUpSignInButton.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _SSButton_module_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SSButton.module.css */ "./src/SignUpSignIn/SignUpSignInButton/SSButton.module.css");
/* harmony import */ var _SSButton_module_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_SSButton_module_css__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/router */ "next/router");
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_1__);


var _jsxFileName = "C:\\Users\\ASUS\\Dropbox\\My PC (DESKTOP-K2J5ET9)\\Desktop\\semiblog\\repo\\src\\SignUpSignIn\\SignUpSignInButton\\SignUpSignInButton.js";



const SignUpSignInButton = ({
  desktopSize
}) => {
  const router = (0,next_router__WEBPACK_IMPORTED_MODULE_1__.useRouter)();

  if (desktopSize) {
    return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("button", {
        className: `${(_SSButton_module_css__WEBPACK_IMPORTED_MODULE_2___default().glowSignInButton)}`,
        type: "button",
        children: "\u0648\u0631\u0648\u062F"
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 10,
        columnNumber: 9
      }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("button", {
        className: `${(_SSButton_module_css__WEBPACK_IMPORTED_MODULE_2___default().glowSignUpButton)}`,
        type: "button",
        children: "\u062B\u0628\u062A \u0646\u0627\u0645"
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 13,
        columnNumber: 9
      }, undefined)]
    }, void 0, true);
  } else {
    return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
        className: `d-flex flex-column align-items-center ${(_SSButton_module_css__WEBPACK_IMPORTED_MODULE_2___default().signInBtnMobile)}`,
        children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("i", {
          className: "fas fa-sign-in-alt",
          "aria-hidden": "true"
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 24,
          columnNumber: 11
        }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("span", {
          children: "\u0648\u0631\u0648\u062F"
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 25,
          columnNumber: 11
        }, undefined)]
      }, void 0, true, {
        fileName: _jsxFileName,
        lineNumber: 21,
        columnNumber: 9
      }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
        className: `d-flex flex-column ms-5 align-items-center ${(_SSButton_module_css__WEBPACK_IMPORTED_MODULE_2___default().signUpBtnMobile)}`,
        children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("i", {
          className: "fas fa-user-plus",
          "aria-hidden": "true"
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 30,
          columnNumber: 11
        }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("span", {
          children: "\u062B\u0628\u062A \u0646\u0627\u0645"
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 31,
          columnNumber: 11
        }, undefined)]
      }, void 0, true, {
        fileName: _jsxFileName,
        lineNumber: 27,
        columnNumber: 9
      }, undefined)]
    }, void 0, true);
  }
};

/* harmony default export */ __webpack_exports__["default"] = (SignUpSignInButton);

/***/ }),

/***/ "./src/Util/ChangeDisplayFormat/IntToString.js":
/*!*****************************************************!*\
  !*** ./src/Util/ChangeDisplayFormat/IntToString.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function intToString(num) {
  if (num < 1000) {
    return num;
  }

  var si = [{
    v: 1e3,
    s: "K"
  }, {
    v: 1e6,
    s: "M"
  }, {
    v: 1e9,
    s: "B"
  }, {
    v: 1e12,
    s: "T"
  }, {
    v: 1e15,
    s: "P"
  }, {
    v: 1e18,
    s: "E"
  }];
  var i;

  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].v) {
      break;
    }
  }

  return (num / si[i].v).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[i].s;
}

/* harmony default export */ __webpack_exports__["default"] = (intToString);

/***/ }),

/***/ "./src/Util/GET/getRequest.js":
/*!************************************!*\
  !*** ./src/Util/GET/getRequest.js ***!
  \************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

const {
  BASE_URL
} = __webpack_require__(/*! ../../BASE_URL/baseUrl */ "./src/BASE_URL/baseUrl.js");

const getRequest = url => {
  return async () => {
    const data = await fetch(BASE_URL + url, {
      method: 'GET',
      credentials: 'include'
    });
    const jsonizedData = await data.json();
    return jsonizedData;
  };
};

module.exports = getRequest;

/***/ }),

/***/ "./public/ad.svg":
/*!***********************!*\
  !*** ./public/ad.svg ***!
  \***********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({"src":"/_next/static/image/public/ad.af65332e63812e0dca4d956e35db8782.svg","height":24,"width":24});

/***/ }),

/***/ "./public/blog.svg":
/*!*************************!*\
  !*** ./public/blog.svg ***!
  \*************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({"src":"/_next/static/image/public/blog.da743c8f11867e995f06b6e46efb0745.svg","height":24,"width":21});

/***/ }),

/***/ "./public/info.svg":
/*!*************************!*\
  !*** ./public/info.svg ***!
  \*************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({"src":"/_next/static/image/public/info.ac3a5dec19a4f3e55e9fb8086993e4a4.svg","height":24,"width":20});

/***/ }),

/***/ "./public/logo.png":
/*!*************************!*\
  !*** ./public/logo.png ***!
  \*************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({"src":"/_next/static/image/public/logo.4680dc71c3c30209440a3c9698e9e32d.png","height":103,"width":77,"blurDataURL":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAICAYAAADaxo44AAAAr0lEQVR42mNYUb+AhQEIDs3fI7p70c5WELtPu4qJAQZW9a48vKp/5Vu4wK6FO9rXTVlzfdOkrv+bJzb/X9a16MyS1kVyDBunrDVe1rn02dZJdf+3T63/v6Jv+e/NszctBOt6/mAf77rJq94CVb8+eWiZKFgQYeTOvpU9y0zgAkUq6Qq11sVGGxasEQTxp6R2sc1ImCrGUKKVNaPKqGBmvVlpZ6dXU1d/UGfFjPgpjQDfV05F3sqjRAAAAABJRU5ErkJggg=="});

/***/ }),

/***/ "./public/mobilelogo.png":
/*!*******************************!*\
  !*** ./public/mobilelogo.png ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({"src":"/_next/static/image/public/mobilelogo.c6f39e139635ed4c6a071cc72ea9a991.png","height":56,"width":54,"blurDataURL":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAA70lEQVR42mMAgStHrzIxQMHhNYcmHNy6XxPEPnngBCMDMljdvnz+8rYl/+89fi0D4u9csZOF4fu/L2z///9n2T5zUdeK3iX/V09c8X/thOlL4Lq2zdpyZHXvijdrJy7+v6W/6Pe2/szfq3pn/1/YuODUzrWbRRn2LNups7hx/uOVfYv/754c/3vvtNTfayYt/b+sffH/DZPXXWIAgUu33/Ou7Z28dd3kJf9X9i78v7Kr98Cp45e0zx44rcCwe+luVpCi////C6/qXP53Yf28qxcfvOdhQAfP7zwV27Vwx65tazcJgfib529mvXj8AiMALwh7crOiOikAAAAASUVORK5CYII="});

/***/ }),

/***/ "./src/Global/Header/BurgerMenu/BurgerMenu.module.css":
/*!************************************************************!*\
  !*** ./src/Global/Header/BurgerMenu/BurgerMenu.module.css ***!
  \************************************************************/
/***/ (function(module) {

// Exports
module.exports = {
	"menu": "BurgerMenu_menu__3bBn_",
	"line": "BurgerMenu_line__2ETaM",
	"line1": "BurgerMenu_line1__6N6-Y",
	"line2": "BurgerMenu_line2__7y4c-",
	"line3": "BurgerMenu_line3__3jmU-",
	"opened": "BurgerMenu_opened__11feV"
};


/***/ }),

/***/ "./src/Global/Header/FAQIcon/FAQ.module.css":
/*!**************************************************!*\
  !*** ./src/Global/Header/FAQIcon/FAQ.module.css ***!
  \**************************************************/
/***/ (function(module) {

// Exports
module.exports = {
	"Qbtn": "FAQ_Qbtn___44MO"
};


/***/ }),

/***/ "./src/Global/Header/HeaderMobile/SubHeader/SubHeader.module.css":
/*!***********************************************************************!*\
  !*** ./src/Global/Header/HeaderMobile/SubHeader/SubHeader.module.css ***!
  \***********************************************************************/
/***/ (function(module) {

// Exports
module.exports = {
	"subHeader": "SubHeader_subHeader__3ae-8",
	"midSubHeader": "SubHeader_midSubHeader__1XPW7"
};


/***/ }),

/***/ "./src/Global/Header/HeaderWrapper/HeaderWrapper.module.css":
/*!******************************************************************!*\
  !*** ./src/Global/Header/HeaderWrapper/HeaderWrapper.module.css ***!
  \******************************************************************/
/***/ (function(module) {

// Exports
module.exports = {
	"searchBarAndLinksWrapper": "HeaderWrapper_searchBarAndLinksWrapper__3_sjB",
	"navBar": "HeaderWrapper_navBar__kk6VM"
};


/***/ }),

/***/ "./src/Global/Header/Icons/Icons.module.css":
/*!**************************************************!*\
  !*** ./src/Global/Header/Icons/Icons.module.css ***!
  \**************************************************/
/***/ (function(module) {

// Exports
module.exports = {
	"headerIconsWrapper": "Icons_headerIconsWrapper___lZ6K",
	"full": "Icons_full__2nZYi",
	"headerIconWrapperMobile": "Icons_headerIconWrapperMobile__2OXxk",
	"wiggle": "Icons_wiggle__1lK6-",
	"userBadge": "Icons_userBadge__xfIDt"
};


/***/ }),

/***/ "./src/Global/Header/My/My.module.css":
/*!********************************************!*\
  !*** ./src/Global/Header/My/My.module.css ***!
  \********************************************/
/***/ (function(module) {

// Exports
module.exports = {
	"my": "My_my__3SXrS"
};


/***/ }),

/***/ "./src/Global/Header/Overlay/Overlay.module.css":
/*!******************************************************!*\
  !*** ./src/Global/Header/Overlay/Overlay.module.css ***!
  \******************************************************/
/***/ (function(module) {

// Exports
module.exports = {
	"searchBarOverLayResults": "Overlay_searchBarOverLayResults__2Xs-6",
	"showStyle": "Overlay_showStyle__m_fE1",
	"droppedMenu": "Overlay_droppedMenu__2x9Vt",
	"droppedMenuHeight": "Overlay_droppedMenuHeight__2UiBF"
};


/***/ }),

/***/ "./src/Global/Header/PageLinks/HeaderLink/HeaderLink.module.css":
/*!**********************************************************************!*\
  !*** ./src/Global/Header/PageLinks/HeaderLink/HeaderLink.module.css ***!
  \**********************************************************************/
/***/ (function(module) {

// Exports
module.exports = {
	"headerLink": "HeaderLink_headerLink__VhZkP",
	"smallHeaderLink": "HeaderLink_smallHeaderLink__30Hc8",
	"hvr-pulse-grow": "HeaderLink_hvr-pulse-grow__2aGmu"
};


/***/ }),

/***/ "./src/Global/Header/SearchBar/SearchBar.module.css":
/*!**********************************************************!*\
  !*** ./src/Global/Header/SearchBar/SearchBar.module.css ***!
  \**********************************************************/
/***/ (function(module) {

// Exports
module.exports = {
	"roundedInput": "SearchBar_roundedInput__3N2e3",
	"roundedIcon": "SearchBar_roundedIcon__SJvCg",
	"searchBar": "SearchBar_searchBar__3Pvdb",
	"smallRoundedIcon": "SearchBar_smallRoundedIcon__1NjaG"
};


/***/ }),

/***/ "./src/Global/Header/User/User.module.css":
/*!************************************************!*\
  !*** ./src/Global/Header/User/User.module.css ***!
  \************************************************/
/***/ (function(module) {

// Exports
module.exports = {
	"userInfoHeader": "User_userInfoHeader__1Y-GJ",
	"userInfoHeaderMobile": "User_userInfoHeaderMobile__1uyvh"
};


/***/ }),

/***/ "./src/Global/Header/searchBarResult/Results/Results.module.css":
/*!**********************************************************************!*\
  !*** ./src/Global/Header/searchBarResult/Results/Results.module.css ***!
  \**********************************************************************/
/***/ (function(module) {

// Exports
module.exports = {
	"searchBarUl": "Results_searchBarUl__2DfM6",
	"searchHeading": "Results_searchHeading__3jtBi"
};


/***/ }),

/***/ "./src/Global/Navigation/Location/CityList/CityList.module.css":
/*!*********************************************************************!*\
  !*** ./src/Global/Navigation/Location/CityList/CityList.module.css ***!
  \*********************************************************************/
/***/ (function(module) {

// Exports
module.exports = {
	"cityList": "CityList_cityList__2Zvqr"
};


/***/ }),

/***/ "./src/Global/Navigation/Location/Location.module.css":
/*!************************************************************!*\
  !*** ./src/Global/Navigation/Location/Location.module.css ***!
  \************************************************************/
/***/ (function(module) {

// Exports
module.exports = {
	"location": "Location_location__fJWff"
};


/***/ }),

/***/ "./src/SignUpSignIn/SignUpSignInButton/SSButton.module.css":
/*!*****************************************************************!*\
  !*** ./src/SignUpSignIn/SignUpSignInButton/SSButton.module.css ***!
  \*****************************************************************/
/***/ (function(module) {

// Exports
module.exports = {
	"glowSignUpButton": "SSButton_glowSignUpButton__ATlVT",
	"glowSignInButton": "SSButton_glowSignInButton__23JQl",
	"glowing": "SSButton_glowing__1UWka",
	"signInBtnMobile": "SSButton_signInBtnMobile__qZIgQ",
	"signUpBtnMobile": "SSButton_signUpBtnMobile__PXavw",
	"hvr-wobble-horizontal": "SSButton_hvr-wobble-horizontal__3CLX2"
};


/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (function() {



/***/ }),

/***/ "./node_modules/next/dist/next-server/server/denormalize-page-path.js":
/*!****************************************************************************!*\
  !*** ./node_modules/next/dist/next-server/server/denormalize-page-path.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";
exports.__esModule=true;exports.normalizePathSep=normalizePathSep;exports.denormalizePagePath=denormalizePagePath;function normalizePathSep(path){return path.replace(/\\/g,'/');}function denormalizePagePath(page){page=normalizePathSep(page);if(page.startsWith('/index/')){page=page.slice(6);}else if(page==='/index'){page='/';}return page;}
//# sourceMappingURL=denormalize-page-path.js.map

/***/ }),

/***/ "./node_modules/next/image.js":
/*!************************************!*\
  !*** ./node_modules/next/image.js ***!
  \************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./dist/client/image */ "./node_modules/next/dist/client/image.js")


/***/ }),

/***/ "./node_modules/next/link.js":
/*!***********************************!*\
  !*** ./node_modules/next/link.js ***!
  \***********************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./dist/client/link */ "./node_modules/next/dist/client/link.js")


/***/ }),

/***/ "./node_modules/next/node_modules/@babel/runtime/helpers/extends.js":
/*!**************************************************************************!*\
  !*** ./node_modules/next/node_modules/@babel/runtime/helpers/extends.js ***!
  \**************************************************************************/
/***/ (function(module) {

function _extends() {
  module.exports = _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

module.exports = _extends;

/***/ }),

/***/ "./node_modules/next/node_modules/@babel/runtime/helpers/interopRequireDefault.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/next/node_modules/@babel/runtime/helpers/interopRequireDefault.js ***!
  \****************************************************************************************/
/***/ (function(module) {

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault;

/***/ }),

/***/ "./node_modules/next/node_modules/@babel/runtime/helpers/interopRequireWildcard.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/next/node_modules/@babel/runtime/helpers/interopRequireWildcard.js ***!
  \*****************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var _typeof = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/next/node_modules/@babel/runtime/helpers/typeof.js");

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function _getRequireWildcardCache() {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
    return {
      "default": obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj["default"] = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

module.exports = _interopRequireWildcard;

/***/ }),

/***/ "./node_modules/next/node_modules/@babel/runtime/helpers/objectWithoutPropertiesLoose.js":
/*!***********************************************************************************************!*\
  !*** ./node_modules/next/node_modules/@babel/runtime/helpers/objectWithoutPropertiesLoose.js ***!
  \***********************************************************************************************/
/***/ (function(module) {

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

module.exports = _objectWithoutPropertiesLoose;

/***/ }),

/***/ "./node_modules/next/node_modules/@babel/runtime/helpers/typeof.js":
/*!*************************************************************************!*\
  !*** ./node_modules/next/node_modules/@babel/runtime/helpers/typeof.js ***!
  \*************************************************************************/
/***/ (function(module) {

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/***/ (function(module) {

"use strict";
module.exports = require("lodash");;

/***/ }),

/***/ "../next-server/lib/head":
/*!****************************************************!*\
  !*** external "next/dist/next-server/lib/head.js" ***!
  \****************************************************/
/***/ (function(module) {

"use strict";
module.exports = require("next/dist/next-server/lib/head.js");;

/***/ }),

/***/ "../next-server/lib/router-context":
/*!**************************************************************!*\
  !*** external "next/dist/next-server/lib/router-context.js" ***!
  \**************************************************************/
/***/ (function(module) {

"use strict";
module.exports = require("next/dist/next-server/lib/router-context.js");;

/***/ }),

/***/ "../next-server/lib/router/utils/get-asset-path-from-route":
/*!**************************************************************************************!*\
  !*** external "next/dist/next-server/lib/router/utils/get-asset-path-from-route.js" ***!
  \**************************************************************************************/
/***/ (function(module) {

"use strict";
module.exports = require("next/dist/next-server/lib/router/utils/get-asset-path-from-route.js");;

/***/ }),

/***/ "../next-server/lib/to-base-64":
/*!**********************************************************!*\
  !*** external "next/dist/next-server/lib/to-base-64.js" ***!
  \**********************************************************/
/***/ (function(module) {

"use strict";
module.exports = require("next/dist/next-server/lib/to-base-64.js");;

/***/ }),

/***/ "../next-server/server/image-config":
/*!***************************************************************!*\
  !*** external "next/dist/next-server/server/image-config.js" ***!
  \***************************************************************/
/***/ (function(module) {

"use strict";
module.exports = require("next/dist/next-server/server/image-config.js");;

/***/ }),

/***/ "next/router":
/*!******************************!*\
  !*** external "next/router" ***!
  \******************************/
/***/ (function(module) {

"use strict";
module.exports = require("next/router");;

/***/ }),

/***/ "nextjs-breadcrumbs":
/*!*************************************!*\
  !*** external "nextjs-breadcrumbs" ***!
  \*************************************/
/***/ (function(module) {

"use strict";
module.exports = require("nextjs-breadcrumbs");;

/***/ }),

/***/ "prop-types":
/*!*****************************!*\
  !*** external "prop-types" ***!
  \*****************************/
/***/ (function(module) {

"use strict";
module.exports = require("prop-types");;

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ (function(module) {

"use strict";
module.exports = require("react");;

/***/ }),

/***/ "react-is":
/*!***************************!*\
  !*** external "react-is" ***!
  \***************************/
/***/ (function(module) {

"use strict";
module.exports = require("react-is");;

/***/ }),

/***/ "react-loading":
/*!********************************!*\
  !*** external "react-loading" ***!
  \********************************/
/***/ (function(module) {

"use strict";
module.exports = require("react-loading");;

/***/ }),

/***/ "react-query":
/*!******************************!*\
  !*** external "react-query" ***!
  \******************************/
/***/ (function(module) {

"use strict";
module.exports = require("react-query");;

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ (function(module) {

"use strict";
module.exports = require("react/jsx-dev-runtime");;

/***/ }),

/***/ "?ca47":
/*!******************************************!*\
  !*** ./utils/resolve-rewrites (ignored) ***!
  \******************************************/
/***/ (function() {

/* (ignored) */

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
var __webpack_exports__ = (__webpack_exec__("./pages/_app.js"));
module.exports = __webpack_exports__;

})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wb3V5YS8uL25vZGVfbW9kdWxlcy9uZXh0L2Rpc3QvY2xpZW50L2ltYWdlLmpzIiwid2VicGFjazovL3BvdXlhLy4vbm9kZV9tb2R1bGVzL25leHQvZGlzdC9jbGllbnQvbGluay5qcyIsIndlYnBhY2s6Ly9wb3V5YS8uL25vZGVfbW9kdWxlcy9uZXh0L2Rpc3QvY2xpZW50L25vcm1hbGl6ZS10cmFpbGluZy1zbGFzaC5qcyIsIndlYnBhY2s6Ly9wb3V5YS8uL25vZGVfbW9kdWxlcy9uZXh0L2Rpc3QvY2xpZW50L3JlcXVlc3QtaWRsZS1jYWxsYmFjay5qcyIsIndlYnBhY2s6Ly9wb3V5YS8uL25vZGVfbW9kdWxlcy9uZXh0L2Rpc3QvY2xpZW50L3JvdXRlLWxvYWRlci5qcyIsIndlYnBhY2s6Ly9wb3V5YS8uL25vZGVfbW9kdWxlcy9uZXh0L2Rpc3QvY2xpZW50L3JvdXRlci5qcyIsIndlYnBhY2s6Ly9wb3V5YS8uL25vZGVfbW9kdWxlcy9uZXh0L2Rpc3QvY2xpZW50L3VzZS1pbnRlcnNlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vcG91eWEvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2NsaWVudC93aXRoLXJvdXRlci5qcyIsIndlYnBhY2s6Ly9wb3V5YS8uL25vZGVfbW9kdWxlcy9uZXh0L2Rpc3QvbmV4dC1zZXJ2ZXIvbGliL2kxOG4vbm9ybWFsaXplLWxvY2FsZS1wYXRoLmpzIiwid2VicGFjazovL3BvdXlhLy4vbm9kZV9tb2R1bGVzL25leHQvZGlzdC9uZXh0LXNlcnZlci9saWIvbWl0dC5qcyIsIndlYnBhY2s6Ly9wb3V5YS8uL25vZGVfbW9kdWxlcy9uZXh0L2Rpc3QvbmV4dC1zZXJ2ZXIvbGliL3JvdXRlci9yb3V0ZXIuanMiLCJ3ZWJwYWNrOi8vcG91eWEvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L25leHQtc2VydmVyL2xpYi9yb3V0ZXIvdXRpbHMvZm9ybWF0LXVybC5qcyIsIndlYnBhY2s6Ly9wb3V5YS8uL25vZGVfbW9kdWxlcy9uZXh0L2Rpc3QvbmV4dC1zZXJ2ZXIvbGliL3JvdXRlci91dGlscy9pcy1keW5hbWljLmpzIiwid2VicGFjazovL3BvdXlhLy4vbm9kZV9tb2R1bGVzL25leHQvZGlzdC9uZXh0LXNlcnZlci9saWIvcm91dGVyL3V0aWxzL3BhcnNlLXJlbGF0aXZlLXVybC5qcyIsIndlYnBhY2s6Ly9wb3V5YS8uL25vZGVfbW9kdWxlcy9uZXh0L2Rpc3QvbmV4dC1zZXJ2ZXIvbGliL3JvdXRlci91dGlscy9xdWVyeXN0cmluZy5qcyIsIndlYnBhY2s6Ly9wb3V5YS8uL25vZGVfbW9kdWxlcy9uZXh0L2Rpc3QvbmV4dC1zZXJ2ZXIvbGliL3JvdXRlci91dGlscy9yb3V0ZS1tYXRjaGVyLmpzIiwid2VicGFjazovL3BvdXlhLy4vbm9kZV9tb2R1bGVzL25leHQvZGlzdC9uZXh0LXNlcnZlci9saWIvcm91dGVyL3V0aWxzL3JvdXRlLXJlZ2V4LmpzIiwid2VicGFjazovL3BvdXlhLy4vbm9kZV9tb2R1bGVzL25leHQvZGlzdC9uZXh0LXNlcnZlci9saWIvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vcG91eWEvLi9wYWdlcy9fYXBwLmpzIiwid2VicGFjazovL3BvdXlhLy4vc3JjL0JBU0VfVVJML2Jhc2VVcmwuanMiLCJ3ZWJwYWNrOi8vcG91eWEvLi9zcmMvQ29udGV4dC9jb250ZXh0LmpzIiwid2VicGFjazovL3BvdXlhLy4vc3JjL0NvbnRleHQvcmVkdWNlci9jaXR5UmVkdWNlci5qcyIsIndlYnBhY2s6Ly9wb3V5YS8uL3NyYy9Db250ZXh0L3JlZHVjZXIvdXNlclJlZHVjZXIuanMiLCJ3ZWJwYWNrOi8vcG91eWEvLi9zcmMvR2xvYmFsL0hlYWRlci9CdXJnZXJNZW51L0J1cmdlck1lbnUuanMiLCJ3ZWJwYWNrOi8vcG91eWEvLi9zcmMvR2xvYmFsL0hlYWRlci9GQVFJY29uL0ZBUUljb24uanMiLCJ3ZWJwYWNrOi8vcG91eWEvLi9zcmMvR2xvYmFsL0hlYWRlci9IZWFkZXJEZXNrdG9wVmlldy9IZWFkZXJEZXNrdG9wVmlldy5qcyIsIndlYnBhY2s6Ly9wb3V5YS8uL3NyYy9HbG9iYWwvSGVhZGVyL0hlYWRlck1vYmlsZS9IZWFkZXJNb2JpbGUuanMiLCJ3ZWJwYWNrOi8vcG91eWEvLi9zcmMvR2xvYmFsL0hlYWRlci9IZWFkZXJNb2JpbGUvU3ViSGVhZGVyL1N1YkhlYWRlci5qcyIsIndlYnBhY2s6Ly9wb3V5YS8uL3NyYy9HbG9iYWwvSGVhZGVyL0hlYWRlcldyYXBwZXIvSGVhZGVyV3JhcHBlci5qcyIsIndlYnBhY2s6Ly9wb3V5YS8uL3NyYy9HbG9iYWwvSGVhZGVyL0ljb25zL0ljb25zLmpzIiwid2VicGFjazovL3BvdXlhLy4vc3JjL0dsb2JhbC9IZWFkZXIvTG9nby9Mb2dvLmpzIiwid2VicGFjazovL3BvdXlhLy4vc3JjL0dsb2JhbC9IZWFkZXIvTXkvTXkuanMiLCJ3ZWJwYWNrOi8vcG91eWEvLi9zcmMvR2xvYmFsL0hlYWRlci9NeS9NeVdyYXBwZXIvTXlXcmFwcGVyLmpzIiwid2VicGFjazovL3BvdXlhLy4vc3JjL0dsb2JhbC9IZWFkZXIvT3ZlcmxheS9PdmVybGF5LmpzIiwid2VicGFjazovL3BvdXlhLy4vc3JjL0dsb2JhbC9IZWFkZXIvUGFnZUxpbmtzL0hlYWRlckxpbmsvSGVhZGVyTGluay5qcyIsIndlYnBhY2s6Ly9wb3V5YS8uL3NyYy9HbG9iYWwvSGVhZGVyL1BhZ2VMaW5rcy9QYWdlTGlua3MuanMiLCJ3ZWJwYWNrOi8vcG91eWEvLi9zcmMvR2xvYmFsL0hlYWRlci9TZWFyY2hCYXIvU2VhcmNoQmFyLmpzIiwid2VicGFjazovL3BvdXlhLy4vc3JjL0dsb2JhbC9IZWFkZXIvVXNlci9Vc2VyLmpzIiwid2VicGFjazovL3BvdXlhLy4vc3JjL0dsb2JhbC9IZWFkZXIvc2VhcmNoQmFyUmVzdWx0L1Jlc3VsdHMvUmVzdWx0cy5qcyIsIndlYnBhY2s6Ly9wb3V5YS8uL3NyYy9HbG9iYWwvSGVhZGVyL3NlYXJjaEJhclJlc3VsdC9TZWFyY2hCYXJSZXN1bHQuanMiLCJ3ZWJwYWNrOi8vcG91eWEvLi9zcmMvR2xvYmFsL0hlYWRlci9zZWFyY2hCYXJSZXN1bHQvU2VhcmNoUmVzdWx0U3Rhci9TZWFyY2hSZXN1bHRTdGFyLmpzIiwid2VicGFjazovL3BvdXlhLy4vc3JjL0dsb2JhbC9OYXZpZ2F0aW9uL0xvY2F0aW9uL0NpdHlMaXN0L0NpdHlMaXN0LmpzIiwid2VicGFjazovL3BvdXlhLy4vc3JjL0dsb2JhbC9OYXZpZ2F0aW9uL0xvY2F0aW9uL0NpdHlMaXN0L0l0ZW1DaXR5LmpzIiwid2VicGFjazovL3BvdXlhLy4vc3JjL0dsb2JhbC9OYXZpZ2F0aW9uL0xvY2F0aW9uL0NpdHkvQ2l0eS5qcyIsIndlYnBhY2s6Ly9wb3V5YS8uL3NyYy9HbG9iYWwvTmF2aWdhdGlvbi9Mb2NhdGlvbi9Mb2NhdGlvbi5qcyIsIndlYnBhY2s6Ly9wb3V5YS8uL3NyYy9HbG9iYWwvTmF2aWdhdGlvbi9Mb2NhdGlvbi9Mb2NhdGlvbk1hcmsvTG9jYXRpb25NYXJrLmpzIiwid2VicGFjazovL3BvdXlhLy4vc3JjL0dsb2JhbC9OYXZpZ2F0aW9uL0xvY2F0aW9uL0xvY2F0aW9uTW9kYWwvTG9jYXRpb25Nb2RhbC5qcyIsIndlYnBhY2s6Ly9wb3V5YS8uL3NyYy9HbG9iYWwvTmF2aWdhdGlvbi9Mb2NhdGlvbi9Qcm92aW5jZS9Qcm92aW5jZS5qcyIsIndlYnBhY2s6Ly9wb3V5YS8uL3NyYy9HbG9iYWwvTmF2aWdhdGlvbi9OYXZpZ2F0aW9uV3JhcHBlci9OYXZpZ2F0aW9uV3JhcHBlci5qcyIsIndlYnBhY2s6Ly9wb3V5YS8uL3NyYy9HbG9iYWwvTmF2aWdhdGlvbi9QYXRoL1BhdGguanMiLCJ3ZWJwYWNrOi8vcG91eWEvLi9zcmMvU2lnblVwU2lnbkluL1NpZ25VcFNpZ25JbkJ1dHRvbi9TaWduVXBTaWduSW5CdXR0b24uanMiLCJ3ZWJwYWNrOi8vcG91eWEvLi9zcmMvVXRpbC9DaGFuZ2VEaXNwbGF5Rm9ybWF0L0ludFRvU3RyaW5nLmpzIiwid2VicGFjazovL3BvdXlhLy4vc3JjL1V0aWwvR0VUL2dldFJlcXVlc3QuanMiLCJ3ZWJwYWNrOi8vcG91eWEvLi9wdWJsaWMvYWQuc3ZnIiwid2VicGFjazovL3BvdXlhLy4vcHVibGljL2Jsb2cuc3ZnIiwid2VicGFjazovL3BvdXlhLy4vcHVibGljL2luZm8uc3ZnIiwid2VicGFjazovL3BvdXlhLy4vcHVibGljL2xvZ28ucG5nIiwid2VicGFjazovL3BvdXlhLy4vcHVibGljL21vYmlsZWxvZ28ucG5nIiwid2VicGFjazovL3BvdXlhLy4vc3JjL0dsb2JhbC9IZWFkZXIvQnVyZ2VyTWVudS9CdXJnZXJNZW51Lm1vZHVsZS5jc3MiLCJ3ZWJwYWNrOi8vcG91eWEvLi9zcmMvR2xvYmFsL0hlYWRlci9GQVFJY29uL0ZBUS5tb2R1bGUuY3NzIiwid2VicGFjazovL3BvdXlhLy4vc3JjL0dsb2JhbC9IZWFkZXIvSGVhZGVyTW9iaWxlL1N1YkhlYWRlci9TdWJIZWFkZXIubW9kdWxlLmNzcyIsIndlYnBhY2s6Ly9wb3V5YS8uL3NyYy9HbG9iYWwvSGVhZGVyL0hlYWRlcldyYXBwZXIvSGVhZGVyV3JhcHBlci5tb2R1bGUuY3NzIiwid2VicGFjazovL3BvdXlhLy4vc3JjL0dsb2JhbC9IZWFkZXIvSWNvbnMvSWNvbnMubW9kdWxlLmNzcyIsIndlYnBhY2s6Ly9wb3V5YS8uL3NyYy9HbG9iYWwvSGVhZGVyL015L015Lm1vZHVsZS5jc3MiLCJ3ZWJwYWNrOi8vcG91eWEvLi9zcmMvR2xvYmFsL0hlYWRlci9PdmVybGF5L092ZXJsYXkubW9kdWxlLmNzcyIsIndlYnBhY2s6Ly9wb3V5YS8uL3NyYy9HbG9iYWwvSGVhZGVyL1BhZ2VMaW5rcy9IZWFkZXJMaW5rL0hlYWRlckxpbmsubW9kdWxlLmNzcyIsIndlYnBhY2s6Ly9wb3V5YS8uL3NyYy9HbG9iYWwvSGVhZGVyL1NlYXJjaEJhci9TZWFyY2hCYXIubW9kdWxlLmNzcyIsIndlYnBhY2s6Ly9wb3V5YS8uL3NyYy9HbG9iYWwvSGVhZGVyL1VzZXIvVXNlci5tb2R1bGUuY3NzIiwid2VicGFjazovL3BvdXlhLy4vc3JjL0dsb2JhbC9IZWFkZXIvc2VhcmNoQmFyUmVzdWx0L1Jlc3VsdHMvUmVzdWx0cy5tb2R1bGUuY3NzIiwid2VicGFjazovL3BvdXlhLy4vc3JjL0dsb2JhbC9OYXZpZ2F0aW9uL0xvY2F0aW9uL0NpdHlMaXN0L0NpdHlMaXN0Lm1vZHVsZS5jc3MiLCJ3ZWJwYWNrOi8vcG91eWEvLi9zcmMvR2xvYmFsL05hdmlnYXRpb24vTG9jYXRpb24vTG9jYXRpb24ubW9kdWxlLmNzcyIsIndlYnBhY2s6Ly9wb3V5YS8uL3NyYy9TaWduVXBTaWduSW4vU2lnblVwU2lnbkluQnV0dG9uL1NTQnV0dG9uLm1vZHVsZS5jc3MiLCJ3ZWJwYWNrOi8vcG91eWEvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L25leHQtc2VydmVyL3NlcnZlci9kZW5vcm1hbGl6ZS1wYWdlLXBhdGguanMiLCJ3ZWJwYWNrOi8vcG91eWEvLi9ub2RlX21vZHVsZXMvbmV4dC9pbWFnZS5qcyIsIndlYnBhY2s6Ly9wb3V5YS8uL25vZGVfbW9kdWxlcy9uZXh0L2xpbmsuanMiLCJ3ZWJwYWNrOi8vcG91eWEvLi9ub2RlX21vZHVsZXMvbmV4dC9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9leHRlbmRzLmpzIiwid2VicGFjazovL3BvdXlhLy4vbm9kZV9tb2R1bGVzL25leHQvbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvaW50ZXJvcFJlcXVpcmVEZWZhdWx0LmpzIiwid2VicGFjazovL3BvdXlhLy4vbm9kZV9tb2R1bGVzL25leHQvbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvaW50ZXJvcFJlcXVpcmVXaWxkY2FyZC5qcyIsIndlYnBhY2s6Ly9wb3V5YS8uL25vZGVfbW9kdWxlcy9uZXh0L25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UuanMiLCJ3ZWJwYWNrOi8vcG91eWEvLi9ub2RlX21vZHVsZXMvbmV4dC9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy90eXBlb2YuanMiLCJ3ZWJwYWNrOi8vcG91eWEvZXh0ZXJuYWwgXCJsb2Rhc2hcIiIsIndlYnBhY2s6Ly9wb3V5YS9leHRlcm5hbCBcIm5leHQvZGlzdC9uZXh0LXNlcnZlci9saWIvaGVhZC5qc1wiIiwid2VicGFjazovL3BvdXlhL2V4dGVybmFsIFwibmV4dC9kaXN0L25leHQtc2VydmVyL2xpYi9yb3V0ZXItY29udGV4dC5qc1wiIiwid2VicGFjazovL3BvdXlhL2V4dGVybmFsIFwibmV4dC9kaXN0L25leHQtc2VydmVyL2xpYi9yb3V0ZXIvdXRpbHMvZ2V0LWFzc2V0LXBhdGgtZnJvbS1yb3V0ZS5qc1wiIiwid2VicGFjazovL3BvdXlhL2V4dGVybmFsIFwibmV4dC9kaXN0L25leHQtc2VydmVyL2xpYi90by1iYXNlLTY0LmpzXCIiLCJ3ZWJwYWNrOi8vcG91eWEvZXh0ZXJuYWwgXCJuZXh0L2Rpc3QvbmV4dC1zZXJ2ZXIvc2VydmVyL2ltYWdlLWNvbmZpZy5qc1wiIiwid2VicGFjazovL3BvdXlhL2V4dGVybmFsIFwibmV4dC9yb3V0ZXJcIiIsIndlYnBhY2s6Ly9wb3V5YS9leHRlcm5hbCBcIm5leHRqcy1icmVhZGNydW1ic1wiIiwid2VicGFjazovL3BvdXlhL2V4dGVybmFsIFwicHJvcC10eXBlc1wiIiwid2VicGFjazovL3BvdXlhL2V4dGVybmFsIFwicmVhY3RcIiIsIndlYnBhY2s6Ly9wb3V5YS9leHRlcm5hbCBcInJlYWN0LWlzXCIiLCJ3ZWJwYWNrOi8vcG91eWEvZXh0ZXJuYWwgXCJyZWFjdC1sb2FkaW5nXCIiLCJ3ZWJwYWNrOi8vcG91eWEvZXh0ZXJuYWwgXCJyZWFjdC1xdWVyeVwiIiwid2VicGFjazovL3BvdXlhL2V4dGVybmFsIFwicmVhY3QvanN4LWRldi1ydW50aW1lXCIiLCJ3ZWJwYWNrOi8vcG91eWEvaWdub3JlZHxDOlxcVXNlcnNcXEFTVVNcXERyb3Bib3hcXE15IFBDIChERVNLVE9QLUsySjVFVDkpXFxEZXNrdG9wXFxzZW1pYmxvZ1xccmVwb1xcbm9kZV9tb2R1bGVzXFxuZXh0XFxkaXN0XFxuZXh0LXNlcnZlclxcbGliXFxyb3V0ZXJ8Li91dGlscy9yZXNvbHZlLXJld3JpdGVzIl0sIm5hbWVzIjpbIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiZXhwb3J0cyIsIkltYWdlIiwiX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UyIiwiX2V4dGVuZHMyIiwiX3JlYWN0IiwiX2hlYWQiLCJfdG9CYXNlIiwiX2ltYWdlQ29uZmlnIiwiX3VzZUludGVyc2VjdGlvbiIsImdsb2JhbCIsIl9fTkVYVF9JTUFHRV9JTVBPUlRFRCIsIlZBTElEX0xPQURJTkdfVkFMVUVTIiwidW5kZWZpbmVkIiwibG9hZGVycyIsIk1hcCIsImltZ2l4TG9hZGVyIiwiY2xvdWRpbmFyeUxvYWRlciIsImFrYW1haUxvYWRlciIsImRlZmF1bHRMb2FkZXIiLCJWQUxJRF9MQVlPVVRfVkFMVUVTIiwiaXNTdGF0aWNSZXF1aXJlIiwic3JjIiwiZGVmYXVsdCIsImlzU3RhdGljSW1hZ2VEYXRhIiwiaXNTdGF0aWNJbXBvcnQiLCJkZXZpY2VTaXplcyIsImNvbmZpZ0RldmljZVNpemVzIiwiaW1hZ2VTaXplcyIsImNvbmZpZ0ltYWdlU2l6ZXMiLCJsb2FkZXIiLCJjb25maWdMb2FkZXIiLCJwYXRoIiwiY29uZmlnUGF0aCIsImRvbWFpbnMiLCJjb25maWdEb21haW5zIiwicHJvY2VzcyIsImltYWdlQ29uZmlnRGVmYXVsdCIsImFsbFNpemVzIiwic29ydCIsImEiLCJiIiwiZ2V0V2lkdGhzIiwid2lkdGgiLCJsYXlvdXQiLCJzaXplcyIsInZpZXdwb3J0V2lkdGhSZSIsInBlcmNlbnRTaXplcyIsIm1hdGNoIiwiZXhlYyIsInB1c2giLCJwYXJzZUludCIsImxlbmd0aCIsInNtYWxsZXN0UmF0aW8iLCJNYXRoIiwibWluIiwid2lkdGhzIiwiZmlsdGVyIiwicyIsImtpbmQiLCJTZXQiLCJtYXAiLCJ3IiwiZmluZCIsInAiLCJnZW5lcmF0ZUltZ0F0dHJzIiwidW5vcHRpbWl6ZWQiLCJxdWFsaXR5Iiwic3JjU2V0IiwibGFzdCIsImkiLCJqb2luIiwiZ2V0SW50IiwieCIsImRlZmF1bHRJbWFnZUxvYWRlciIsImxvYWRlclByb3BzIiwibG9hZCIsImdldCIsInJvb3QiLCJFcnJvciIsIlZBTElEX0xPQURFUlMiLCJyZW1vdmVQbGFjZWhvbGRlciIsImltZyIsInBsYWNlaG9sZGVyIiwiaGFuZGxlTG9hZCIsInN0YXJ0c1dpdGgiLCJkZWNvZGUiLCJQcm9taXNlIiwicmVzb2x2ZSIsImNhdGNoIiwidGhlbiIsInN0eWxlIiwiYmFja2dyb3VuZFNpemUiLCJiYWNrZ3JvdW5kSW1hZ2UiLCJjb21wbGV0ZSIsIm9ubG9hZCIsIl9yZWYiLCJwcmlvcml0eSIsImxvYWRpbmciLCJjbGFzc05hbWUiLCJoZWlnaHQiLCJvYmplY3RGaXQiLCJvYmplY3RQb3NpdGlvbiIsImJsdXJEYXRhVVJMIiwiYWxsIiwicmVzdCIsInN0YXRpY1NyYyIsInN0YXRpY0ltYWdlRGF0YSIsIkpTT04iLCJzdHJpbmdpZnkiLCJ3aWR0aEludCIsImhlaWdodEludCIsInF1YWxpdHlJbnQiLCJpbmNsdWRlcyIsIlN0cmluZyIsImlzTmFOIiwiY29uc29sZSIsIndhcm4iLCJWQUxJRF9CTFVSX0VYVCIsImlzTGF6eSIsInNldFJlZiIsImlzSW50ZXJzZWN0ZWQiLCJ1c2VJbnRlcnNlY3Rpb24iLCJyb290TWFyZ2luIiwiZGlzYWJsZWQiLCJpc1Zpc2libGUiLCJ3cmFwcGVyU3R5bGUiLCJzaXplclN0eWxlIiwic2l6ZXJTdmciLCJpbWdTdHlsZSIsInBvc2l0aW9uIiwidG9wIiwibGVmdCIsImJvdHRvbSIsInJpZ2h0IiwiYm94U2l6aW5nIiwicGFkZGluZyIsImJvcmRlciIsIm1hcmdpbiIsImRpc3BsYXkiLCJtaW5XaWR0aCIsIm1heFdpZHRoIiwibWluSGVpZ2h0IiwibWF4SGVpZ2h0IiwicXVvdGllbnQiLCJwYWRkaW5nVG9wIiwib3ZlcmZsb3ciLCJpbWdBdHRyaWJ1dGVzIiwiY3JlYXRlRWxlbWVudCIsImFsdCIsInJvbGUiLCJ0b0Jhc2U2NCIsIk9iamVjdCIsImFzc2lnbiIsImRlY29kaW5nIiwicmVmIiwiZWxlbWVudCIsImtleSIsInJlbCIsImFzIiwiaHJlZiIsImltYWdlc3Jjc2V0IiwiaW1hZ2VzaXplcyIsIm5vcm1hbGl6ZVNyYyIsInNsaWNlIiwicGFyYW1zIiwicGFyYW1zU3RyaW5nIiwibWlzc2luZ1ZhbHVlcyIsInBhcnNlZFNyYyIsIlVSTCIsImVyciIsImVycm9yIiwiaG9zdG5hbWUiLCJlbmNvZGVVUklDb21wb25lbnQiLCJfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCIsIl9yb3V0ZXIiLCJfcm91dGVyMiIsInByZWZldGNoZWQiLCJwcmVmZXRjaCIsInJvdXRlciIsIm9wdGlvbnMiLCJpc0xvY2FsVVJMIiwiY3VyTG9jYWxlIiwibG9jYWxlIiwiaXNNb2RpZmllZEV2ZW50IiwiZXZlbnQiLCJ0YXJnZXQiLCJjdXJyZW50VGFyZ2V0IiwibWV0YUtleSIsImN0cmxLZXkiLCJzaGlmdEtleSIsImFsdEtleSIsIm5hdGl2ZUV2ZW50Iiwid2hpY2giLCJsaW5rQ2xpY2tlZCIsImUiLCJyZXBsYWNlIiwic2hhbGxvdyIsInNjcm9sbCIsIm5vZGVOYW1lIiwicHJldmVudERlZmF1bHQiLCJpbmRleE9mIiwiTGluayIsInByb3BzIiwiY3JlYXRlUHJvcEVycm9yIiwiYXJncyIsImV4cGVjdGVkIiwiYWN0dWFsIiwicmVxdWlyZWRQcm9wc0d1YXJkIiwicmVxdWlyZWRQcm9wcyIsImtleXMiLCJmb3JFYWNoIiwiXyIsIm9wdGlvbmFsUHJvcHNHdWFyZCIsInBhc3NIcmVmIiwib3B0aW9uYWxQcm9wcyIsInZhbFR5cGUiLCJoYXNXYXJuZWQiLCJ1c2VSZWYiLCJjdXJyZW50IiwidXNlUm91dGVyIiwidXNlTWVtbyIsInJlc29sdmVkSHJlZiIsInJlc29sdmVkQXMiLCJyZXNvbHZlSHJlZiIsImNoaWxkcmVuIiwiY2hpbGQiLCJDaGlsZHJlbiIsIm9ubHkiLCJjaGlsZFJlZiIsInNldEludGVyc2VjdGlvblJlZiIsInVzZUNhbGxiYWNrIiwiZWwiLCJ1c2VFZmZlY3QiLCJzaG91bGRQcmVmZXRjaCIsImlzUHJlZmV0Y2hlZCIsImNoaWxkUHJvcHMiLCJvbkNsaWNrIiwiZGVmYXVsdFByZXZlbnRlZCIsIm9uTW91c2VFbnRlciIsInR5cGUiLCJsb2NhbGVEb21haW4iLCJpc0xvY2FsZURvbWFpbiIsImdldERvbWFpbkxvY2FsZSIsImxvY2FsZXMiLCJkb21haW5Mb2NhbGVzIiwiYWRkQmFzZVBhdGgiLCJhZGRMb2NhbGUiLCJkZWZhdWx0TG9jYWxlIiwiY2xvbmVFbGVtZW50IiwiX2RlZmF1bHQiLCJyZW1vdmVQYXRoVHJhaWxpbmdTbGFzaCIsImVuZHNXaXRoIiwibm9ybWFsaXplUGF0aFRyYWlsaW5nU2xhc2giLCJyZXF1ZXN0SWRsZUNhbGxiYWNrIiwic2VsZiIsImNiIiwic3RhcnQiLCJEYXRlIiwibm93Iiwic2V0VGltZW91dCIsImRpZFRpbWVvdXQiLCJ0aW1lUmVtYWluaW5nIiwibWF4IiwiY2FuY2VsSWRsZUNhbGxiYWNrIiwiaWQiLCJjbGVhclRpbWVvdXQiLCJtYXJrQXNzZXRFcnJvciIsImlzQXNzZXRFcnJvciIsImdldENsaWVudEJ1aWxkTWFuaWZlc3QiLCJfZ2V0QXNzZXRQYXRoRnJvbVJvdXRlIiwiX3JlcXVlc3RJZGxlQ2FsbGJhY2siLCJNU19NQVhfSURMRV9ERUxBWSIsIndpdGhGdXR1cmUiLCJnZW5lcmF0b3IiLCJlbnRyeSIsImZ1dHVyZSIsInJlc29sdmVyIiwicHJvbSIsInNldCIsInZhbHVlIiwiaGFzUHJlZmV0Y2giLCJsaW5rIiwiZG9jdW1lbnQiLCJ3aW5kb3ciLCJNU0lucHV0TWV0aG9kQ29udGV4dCIsImRvY3VtZW50TW9kZSIsInJlbExpc3QiLCJzdXBwb3J0cyIsIl91bnVzZWQiLCJjYW5QcmVmZXRjaCIsInByZWZldGNoVmlhRG9tIiwicmVzIiwicmVqIiwicXVlcnlTZWxlY3RvciIsImNyb3NzT3JpZ2luIiwib25lcnJvciIsImhlYWQiLCJhcHBlbmRDaGlsZCIsIkFTU0VUX0xPQURfRVJST1IiLCJTeW1ib2wiLCJkZWZpbmVQcm9wZXJ0eSIsImFwcGVuZFNjcmlwdCIsInNjcmlwdCIsInJlamVjdCIsImJvZHkiLCJyZXNvbHZlUHJvbWlzZVdpdGhUaW1lb3V0IiwibXMiLCJjYW5jZWxsZWQiLCJyIiwiX19CVUlMRF9NQU5JRkVTVCIsIm9uQnVpbGRNYW5pZmVzdCIsIl9fQlVJTERfTUFOSUZFU1RfQ0IiLCJnZXRGaWxlc0ZvclJvdXRlIiwiYXNzZXRQcmVmaXgiLCJyb3V0ZSIsInNjcmlwdHMiLCJlbmNvZGVVUkkiLCJjc3MiLCJtYW5pZmVzdCIsImFsbEZpbGVzIiwidiIsImNyZWF0ZVJvdXRlTG9hZGVyIiwiZW50cnlwb2ludHMiLCJsb2FkZWRTY3JpcHRzIiwic3R5bGVTaGVldHMiLCJyb3V0ZXMiLCJtYXliZUV4ZWN1dGVTY3JpcHQiLCJmZXRjaFN0eWxlU2hlZXQiLCJmZXRjaCIsIm9rIiwidGV4dCIsImNvbnRlbnQiLCJ3aGVuRW50cnlwb2ludCIsIm9uRW50cnlwb2ludCIsImV4ZWN1dGUiLCJmbiIsImNvbXBvbmVudCIsImlucHV0Iiwib2xkIiwibG9hZFJvdXRlIiwiaGFzIiwiZW50cnlwb2ludCIsInN0eWxlcyIsImNuIiwibmF2aWdhdG9yIiwiY29ubmVjdGlvbiIsInNhdmVEYXRhIiwidGVzdCIsImVmZmVjdGl2ZVR5cGUiLCJvdXRwdXQiLCJtYWtlUHVibGljUm91dGVySW5zdGFuY2UiLCJOZXh0Um91dGVyIiwiX3JvdXRlckNvbnRleHQiLCJfd2l0aFJvdXRlciIsInNpbmdsZXRvblJvdXRlciIsInJlYWR5Q2FsbGJhY2tzIiwicmVhZHkiLCJ1cmxQcm9wZXJ0eUZpZWxkcyIsInJvdXRlckV2ZW50cyIsImNvcmVNZXRob2RGaWVsZHMiLCJldmVudHMiLCJmaWVsZCIsImdldFJvdXRlciIsIm9uIiwiZXZlbnRGaWVsZCIsImNoYXJBdCIsInRvVXBwZXJDYXNlIiwic3Vic3RyaW5nIiwiX3NpbmdsZXRvblJvdXRlciIsIm1lc3NhZ2UiLCJzdGFjayIsInVzZUNvbnRleHQiLCJSb3V0ZXJDb250ZXh0IiwiY3JlYXRlUm91dGVyIiwiaW5zdGFuY2UiLCJwcm9wZXJ0eSIsIkFycmF5IiwiaXNBcnJheSIsImhhc0ludGVyc2VjdGlvbk9ic2VydmVyIiwiSW50ZXJzZWN0aW9uT2JzZXJ2ZXIiLCJpc0Rpc2FibGVkIiwidW5vYnNlcnZlIiwidmlzaWJsZSIsInNldFZpc2libGUiLCJ1c2VTdGF0ZSIsInRhZ05hbWUiLCJvYnNlcnZlIiwiaWRsZUNhbGxiYWNrIiwiY2FsbGJhY2siLCJvYnNlcnZlciIsImVsZW1lbnRzIiwiY3JlYXRlT2JzZXJ2ZXIiLCJkZWxldGUiLCJzaXplIiwiZGlzY29ubmVjdCIsIm9ic2VydmVycyIsImVudHJpZXMiLCJpc0ludGVyc2VjdGluZyIsImludGVyc2VjdGlvblJhdGlvIiwid2l0aFJvdXRlciIsIkNvbXBvc2VkQ29tcG9uZW50IiwiV2l0aFJvdXRlcldyYXBwZXIiLCJnZXRJbml0aWFsUHJvcHMiLCJvcmlnR2V0SW5pdGlhbFByb3BzIiwibmFtZSIsImRpc3BsYXlOYW1lIiwibm9ybWFsaXplTG9jYWxlUGF0aCIsInBhdGhuYW1lIiwiZGV0ZWN0ZWRMb2NhbGUiLCJwYXRobmFtZVBhcnRzIiwic3BsaXQiLCJzb21lIiwidG9Mb3dlckNhc2UiLCJzcGxpY2UiLCJtaXR0IiwiY3JlYXRlIiwiaGFuZGxlciIsIm9mZiIsImVtaXQiLCJldnRzIiwiZGVsTG9jYWxlIiwiaGFzQmFzZVBhdGgiLCJkZWxCYXNlUGF0aCIsImludGVycG9sYXRlQXMiLCJfbm9ybWFsaXplVHJhaWxpbmdTbGFzaCIsIl9yb3V0ZUxvYWRlciIsIl9kZW5vcm1hbGl6ZVBhZ2VQYXRoIiwiX25vcm1hbGl6ZUxvY2FsZVBhdGgiLCJfbWl0dCIsIl91dGlscyIsIl9pc0R5bmFtaWMiLCJfcGFyc2VSZWxhdGl2ZVVybCIsIl9xdWVyeXN0cmluZyIsIl9yZXNvbHZlUmV3cml0ZXMiLCJfcm91dGVNYXRjaGVyIiwiX3JvdXRlUmVnZXgiLCJvYmoiLCJfX2VzTW9kdWxlIiwiZGV0ZWN0RG9tYWluTG9jYWxlIiwiYmFzZVBhdGgiLCJidWlsZENhbmNlbGxhdGlvbkVycm9yIiwiYWRkUGF0aFByZWZpeCIsInByZWZpeCIsInBhdGhOb1F1ZXJ5SGFzaCIsInF1ZXJ5SW5kZXgiLCJoYXNoSW5kZXgiLCJ1cmwiLCJsb2NhdGlvbk9yaWdpbiIsImdldExvY2F0aW9uT3JpZ2luIiwicmVzb2x2ZWQiLCJvcmlnaW4iLCJhc1BhdGhuYW1lIiwicXVlcnkiLCJpbnRlcnBvbGF0ZWRSb3V0ZSIsImR5bmFtaWNSZWdleCIsImdldFJvdXRlUmVnZXgiLCJkeW5hbWljR3JvdXBzIiwiZ3JvdXBzIiwiZHluYW1pY01hdGNoZXMiLCJnZXRSb3V0ZU1hdGNoZXIiLCJldmVyeSIsInBhcmFtIiwicmVwZWF0Iiwib3B0aW9uYWwiLCJyZXBsYWNlZCIsInNlZ21lbnQiLCJyZXN1bHQiLCJvbWl0UGFybXNGcm9tUXVlcnkiLCJmaWx0ZXJlZFF1ZXJ5IiwicmVzb2x2ZUFzIiwiYmFzZSIsInVybEFzU3RyaW5nIiwiZm9ybWF0V2l0aFZhbGlkYXRpb24iLCJhc1BhdGgiLCJmaW5hbFVybCIsImludGVycG9sYXRlZEFzIiwiaXNEeW5hbWljUm91dGUiLCJzZWFyY2hQYXJhbXMiLCJzZWFyY2hQYXJhbXNUb1VybFF1ZXJ5IiwiaGFzaCIsInN0cmlwT3JpZ2luIiwicHJlcGFyZVVybEFzIiwiaHJlZkhhZE9yaWdpbiIsImFzSGFkT3JpZ2luIiwicHJlcGFyZWRVcmwiLCJwcmVwYXJlZEFzIiwicmVzb2x2ZUR5bmFtaWNSb3V0ZSIsInBhZ2VzIiwiY2xlYW5QYXRobmFtZSIsImRlbm9ybWFsaXplUGFnZVBhdGgiLCJwYWdlIiwicmUiLCJtYW51YWxTY3JvbGxSZXN0b3JhdGlvbiIsIlNTR19EQVRBX05PVF9GT1VORCIsImZldGNoUmV0cnkiLCJhdHRlbXB0cyIsImNyZWRlbnRpYWxzIiwic3RhdHVzIiwianNvbiIsImRhdGEiLCJub3RGb3VuZCIsImZldGNoTmV4dERhdGEiLCJkYXRhSHJlZiIsImlzU2VydmVyUmVuZGVyIiwiUm91dGVyIiwiY29uc3RydWN0b3IiLCJfcGF0aG5hbWUiLCJfcXVlcnkiLCJfYXMiLCJpbml0aWFsUHJvcHMiLCJwYWdlTG9hZGVyIiwiQXBwIiwid3JhcEFwcCIsIkNvbXBvbmVudCIsInN1YnNjcmlwdGlvbiIsImlzRmFsbGJhY2siLCJpc1ByZXZpZXciLCJjb21wb25lbnRzIiwic2RjIiwic2RyIiwic3ViIiwiY2xjIiwiX2JwcyIsIl93cmFwQXBwIiwiaXNTc3IiLCJfaW5GbGlnaHRSb3V0ZSIsIl9zaGFsbG93IiwiaXNSZWFkeSIsIl9pZHgiLCJvblBvcFN0YXRlIiwic3RhdGUiLCJjaGFuZ2VTdGF0ZSIsImdldFVSTCIsIl9fTiIsImZvcmNlZFNjcm9sbCIsImlkeCIsInBhcnNlUmVsYXRpdmVVcmwiLCJjaGFuZ2UiLCJpbml0aWFsIiwiX19OX1NTRyIsIl9fTl9TU1AiLCJhdXRvRXhwb3J0RHluYW1pYyIsIl9fTkVYVF9EQVRBX18iLCJhdXRvRXhwb3J0IiwiZ3NzcCIsImdpcCIsImxvY2F0aW9uIiwic2VhcmNoIiwicmVsb2FkIiwiYmFjayIsImhpc3RvcnkiLCJtZXRob2QiLCJzaG91bGRSZXNvbHZlSHJlZiIsIl9oIiwiX3Nob3VsZFJlc29sdmVIcmVmIiwibG9jYWxlQ2hhbmdlIiwiU1QiLCJwZXJmb3JtYW5jZSIsIm1hcmsiLCJyb3V0ZVByb3BzIiwiYWJvcnRDb21wb25lbnRMb2FkIiwiY2xlYW5lZEFzIiwib25seUFIYXNoQ2hhbmdlIiwic2Nyb2xsVG9IYXNoIiwibm90aWZ5IiwicGFyc2VkIiwicmV3cml0ZXMiLCJnZXRQYWdlTGlzdCIsIl9fcmV3cml0ZXMiLCJ1cmxJc05ldyIsInBhcnNlZEFzIiwicm91dGVSZWdleCIsInJvdXRlTWF0Y2giLCJzaG91bGRJbnRlcnBvbGF0ZSIsIm1pc3NpbmdQYXJhbXMiLCJfc2VsZiRfX05FWFRfREFUQV9fJHAiLCJfc2VsZiRfX05FWFRfREFUQV9fJHAyIiwiX29wdGlvbnMkc2Nyb2xsIiwicm91dGVJbmZvIiwiZ2V0Um91dGVJbmZvIiwicGFnZVByb3BzIiwiX19OX1JFRElSRUNUIiwiZGVzdGluYXRpb24iLCJwYXJzZWRIcmVmIiwibmV3VXJsIiwibmV3QXMiLCJfX05fUFJFVklFVyIsIm5vdEZvdW5kUm91dGUiLCJmZXRjaENvbXBvbmVudCIsImFwcENvbXAiLCJuZXh0IiwiaXNQcmVyZW5kZXJlZCIsInN0YXR1c0NvZGUiLCJpc1ZhbGlkU2hhbGxvd1JvdXRlIiwic2hvdWxkU2Nyb2xsIiwicmVzZXRTY3JvbGwiLCJ5IiwiaGFuZGxlUm91dGVJbmZvRXJyb3IiLCJsb2FkRXJyb3JGYWlsIiwiZ2lwRXJyIiwicm91dGVJbmZvRXJyIiwiZXhpc3RpbmdSb3V0ZUluZm8iLCJjYWNoZWRSb3V0ZUluZm8iLCJtb2QiLCJpc1ZhbGlkRWxlbWVudFR5cGUiLCJnZXREYXRhSHJlZiIsIl9nZXREYXRhIiwiX2dldFN0YXRpY0RhdGEiLCJfZ2V0U2VydmVyRGF0YSIsImJlZm9yZVBvcFN0YXRlIiwib2xkVXJsTm9IYXNoIiwib2xkSGFzaCIsIm5ld1VybE5vSGFzaCIsIm5ld0hhc2giLCJzY3JvbGxUbyIsImlkRWwiLCJnZXRFbGVtZW50QnlJZCIsInNjcm9sbEludG9WaWV3IiwibmFtZUVsIiwiZ2V0RWxlbWVudHNCeU5hbWUiLCJfaXNTc2ciLCJpc1NzZyIsImNhbmNlbCIsImNvbXBvbmVudFJlc3VsdCIsImxvYWRQYWdlIiwiY2FjaGVLZXkiLCJyZXNvdXJjZUtleSIsImN0eCIsIkFwcFRyZWUiLCJsb2FkR2V0SW5pdGlhbFByb3BzIiwiZm9ybWF0VXJsIiwicXVlcnlzdHJpbmciLCJfZ2V0UmVxdWlyZVdpbGRjYXJkQ2FjaGUiLCJXZWFrTWFwIiwiY2FjaGUiLCJuZXdPYmoiLCJoYXNQcm9wZXJ0eURlc2NyaXB0b3IiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJkZXNjIiwic2xhc2hlZFByb3RvY29scyIsInVybE9iaiIsImF1dGgiLCJwcm90b2NvbCIsImhvc3QiLCJwb3J0IiwidXJsUXVlcnlUb1NlYXJjaFBhcmFtcyIsInN1YnN0ciIsInNsYXNoZXMiLCJURVNUX1JPVVRFIiwiZ2xvYmFsQmFzZSIsInJlc29sdmVkQmFzZSIsInN0cmluZ2lmeVVybFF1ZXJ5UGFyYW0iLCJ1cmxRdWVyeSIsIlVSTFNlYXJjaFBhcmFtcyIsIml0ZW0iLCJhcHBlbmQiLCJzZWFyY2hQYXJhbXNMaXN0IiwiZnJvbSIsImRlY29kZVVSSUNvbXBvbmVudCIsImNvZGUiLCJzbHVnTmFtZSIsImciLCJtIiwicG9zIiwiZXNjYXBlUmVnZXgiLCJzdHIiLCJwYXJzZVBhcmFtZXRlciIsIm5vcm1hbGl6ZWRSb3V0ZSIsInNlZ21lbnRzIiwiZ3JvdXBJbmRleCIsInBhcmFtZXRlcml6ZWRSb3V0ZSIsInJvdXRlS2V5Q2hhckNvZGUiLCJyb3V0ZUtleUNoYXJMZW5ndGgiLCJnZXRTYWZlUm91dGVLZXkiLCJyb3V0ZUtleSIsImZyb21DaGFyQ29kZSIsInJvdXRlS2V5cyIsIm5hbWVkUGFyYW1ldGVyaXplZFJvdXRlIiwiY2xlYW5lZEtleSIsImludmFsaWRLZXkiLCJSZWdFeHAiLCJuYW1lZFJlZ2V4IiwiZXhlY09uY2UiLCJnZXREaXNwbGF5TmFtZSIsImlzUmVzU2VudCIsIl9mb3JtYXRVcmwiLCJ1c2VkIiwiZmluaXNoZWQiLCJoZWFkZXJzU2VudCIsIl9BcHAkcHJvdG90eXBlIiwidXJsT2JqZWN0S2V5cyIsIlNQIiwibWVhc3VyZSIsIk15QXBwIiwianNzU3R5bGVzIiwicGFyZW50RWxlbWVudCIsInJlbW92ZUNoaWxkIiwicXVlcnlDbGllbnQiLCJRdWVyeUNsaWVudCIsImRlZmF1bHRPcHRpb25zIiwicXVlcmllcyIsInJlZmV0Y2hPbldpbmRvd0ZvY3VzIiwicmVmZXRjaE9ubW91bnQiLCJyZWZldGNoT25SZWNvbm5lY3QiLCJyZXRyeSIsInByb3BUeXBlcyIsIlByb3BUeXBlcyIsImlzUmVxdWlyZWQiLCJCQVNFX1VSTCIsIkJBU0VfVklERU9fVVJMIiwiQkFTRV9JTUFHRV9VUkwiLCJCQVNFX0ZJTEVfVVJMIiwiQXBwQ29udGV4dCIsIkFwcFdyYXBwZXIiLCJ1c2VyIiwiZGlzcGF0Y2giLCJ1c2VyUmVkdWNlciIsInVzZXJJbml0U3RhdGUiLCJjaXRpZXMiLCJzZXRDaXRpZXMiLCJjaXR5UmVkdWNlciIsImNpdHlJbml0U3RhdGUiLCJjb250cm9sbGVyIiwiQWJvcnRDb250cm9sbGVyIiwiZ2V0VXNlckRhdGEiLCJ1c2VyRGF0YSIsInNpZ25hbCIsIm1vbmdvSWQiLCJwYXlsb2FkIiwicm9sZVR5cGUiLCJhYm9ydCIsImNoYW5nZXIiLCJkaXNwYXRjaENpdHkiLCJVc2VBcHBDb250ZXh0IiwibW9kdWxlIiwiYWN0aW9uIiwibmV3U3RhdGUiLCJjb25jYXQiLCJjaXR5IiwiaXRtIiwidXNlcm5hbWUiLCJhdmF0YXIiLCJ1c2VyVHlwZSIsImlzUmVzdHJpY3RlZCIsImVtYWlsVmVyaWZpZWQiLCJtb2JpbGVWZXJpZmllZCIsIm1vYmlsZSIsImVtYWlsIiwiQnVyZ2VyTWVudSIsInNldERyb3BEb3duTWVudUhlaWdodCIsInNldERyb3BNZW51Q29udGVudCIsImJ1cmdlclN0eWxlIiwic2V0QnVyZ2VyU3R5bGUiLCJjaGFuZ2VCdXJnZXJNZW51U3R5bGUiLCJSZWFjdCIsIkZBUUljb24iLCJIZWFkZXJEZXNrdG9wVmlldyIsInNlYXJjaEJhckFuZExpbmtzV3JhcHBlciIsInNldFVzZXJTZWFyY2giLCJ1c2VyU2VhcmNoIiwic2hvd1N0eWxlIiwic2V0U2hvd1N0eWxlIiwicmVtb3ZlT3ZlcmxheSIsImNsb3Nlc3QiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImxvZ28iLCJIZWFkZXJNb2JpbGUiLCJtb2JpbGVsb2dvIiwiU3ViSGVhZGVyIiwiZHJvcERvd25NZW51SGVpZ2h0IiwiZHJvcE1lbnVDb250ZW50IiwiRHJvcE1lbnVDb250ZW50IiwiSGVhZGVyV3JhcHBlciIsIkhlYWRlckljb25zIiwiaWNvblN0eWxlIiwidW5yZWFkTXNnQ291bnQiLCJ1c2VRdWVyeSIsImdldFJlcXVlc3QiLCJ1bnJlYWROb3RpZmljYXRpb25zIiwidG90YWwiLCJ1bnJlYWRNZXNzYWdlc0NvdW50IiwiTG9nbyIsIk15IiwiY3JlZGl0IiwiZW50aXR5IiwiaW50VG9TdHJpbmciLCJNeVdyYXBwZXIiLCJteVN0eWxlIiwiT3ZlckxheSIsIm92ZXJMYXlTdHlsZSIsIkhlYWRlckxpbmsiLCJsaW5rVG8iLCJpY29uIiwibmF2TGlDbGFzcyIsIlBhZ2VMaW5rcyIsImNscyIsImFkIiwiaW5mbyIsImJsb2ciLCJTZWFyY2hCYXIiLCJkZXNrdG9wIiwidGltZXIiLCJzZWFyY2hIYW5kbGVyIiwidHJpbSIsInNlYXJjaFJlcyIsInNlYXJjaFJlc0pzb24iLCJwcnZzIiwiVXNlciIsInVzZXJJbmZvQ2xhc3MiLCJSZXN1bHRzIiwicmVzdWx0cyIsInNlYXJjaEJhckNsYXNzIiwiYWRUeXBlIiwidGl0bGUiLCJtYXJnaW5SaWdodCIsIm1hcmdpbkJvdHRvbSIsInBhZGRpbmdCb3R0b20iLCJTZWFyY2hCYXJSZXN1bHQiLCJhZHMiLCJpbmZvQmFua3MiLCJTZWFyY2hSZXN1bHRTdGFyIiwiY291bnQiLCJzdGFycyIsImNvbG9yIiwibWFyZ2luTGVmdCIsIkNpdHlMaXN0IiwiaXRlbUNpdGllcyIsIkl0ZW1DaXR5IiwiY2l0eU5hbWUiLCJjaXR5SWQiLCJyZW1vdmVDaXR5IiwiQ2l0eSIsInByb3ZpbmNlSWQiLCJzZXRDaXR5IiwiaXNMb2FkaW5nIiwiZW5hYmxlZCIsImFkZENpdHkiLCJzZWxlY3RlZCIsIm9wdGlvbiIsImRhdGFzZXQiLCJvcHRpb25DaXRpZXMiLCJDaXRpZXMiLCJMb2NhdGlvbiIsIkxvY2F0aW9uTWFyayIsInNldEljb24iLCJMb2NhdGlvbk1vZGFsIiwicHJvdmluY2UiLCJzZXRQcm92aW5jZSIsInJlbUxvYyIsImRpc3Bvc2VNb2RhbCIsInJlZnJlc2hMb2MiLCJQcm92aW5jZSIsImNob29zZVByb3ZpbmNlIiwicHJvdmluY2VzIiwiTmF2aWdhdGlvbldyYXBwZXIiLCJjaG9vc2VDaXR5Iiwic2V0Q2hvb3NlQ2l0eSIsIlBhdGgiLCJjaGFuZ2VMYWJlbCIsIlNpZ25VcFNpZ25JbkJ1dHRvbiIsImRlc2t0b3BTaXplIiwibnVtIiwic2kiLCJ0b0ZpeGVkIiwianNvbml6ZWREYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQWE7O0FBQUEsSUFBSUEsc0JBQXNCLEdBQUNDLG1CQUFPLENBQUMsc0lBQUQsQ0FBbEM7O0FBQW1GQyxrQkFBQSxHQUFtQixJQUFuQjtBQUF3QkEsZUFBQSxHQUFnQkMsS0FBaEI7O0FBQXNCLElBQUlDLDhCQUE4QixHQUFDSixzQkFBc0IsQ0FBQ0MsbUJBQU8sQ0FBQyxvSkFBRCxDQUFSLENBQXpEOztBQUEwSCxJQUFJSSxTQUFTLEdBQUNMLHNCQUFzQixDQUFDQyxtQkFBTyxDQUFDLDBHQUFELENBQVIsQ0FBcEM7O0FBQWdGLElBQUlLLE1BQU0sR0FBQ04sc0JBQXNCLENBQUNDLG1CQUFPLENBQUMsb0JBQUQsQ0FBUixDQUFqQzs7QUFBb0QsSUFBSU0sS0FBSyxHQUFDUCxzQkFBc0IsQ0FBQ0MsbUJBQU8sQ0FBQyx3REFBRCxDQUFSLENBQWhDOztBQUFxRSxJQUFJTyxPQUFPLEdBQUNQLG1CQUFPLENBQUMsb0VBQUQsQ0FBbkI7O0FBQXFELElBQUlRLFlBQVksR0FBQ1IsbUJBQU8sQ0FBQyw4RUFBRCxDQUF4Qjs7QUFBK0QsSUFBSVMsZ0JBQWdCLEdBQUNULG1CQUFPLENBQUMsK0VBQUQsQ0FBNUI7O0FBQW1ELFVBQStCO0FBQUM7QUFBQ1UsUUFBTSxDQUFDQyxxQkFBUCxHQUE2QixJQUE3QjtBQUFtQzs7QUFBQSxNQUFNQyxvQkFBb0IsR0FBQyxDQUFDLE1BQUQsRUFBUSxPQUFSLEVBQWdCQyxTQUFoQixDQUEzQjtBQUFzRCxNQUFNQyxPQUFPLEdBQUMsSUFBSUMsR0FBSixDQUFRLENBQUMsQ0FBQyxPQUFELEVBQVNDLFdBQVQsQ0FBRCxFQUF1QixDQUFDLFlBQUQsRUFBY0MsZ0JBQWQsQ0FBdkIsRUFBdUQsQ0FBQyxRQUFELEVBQVVDLFlBQVYsQ0FBdkQsRUFBK0UsQ0FBQyxTQUFELEVBQVdDLGFBQVgsQ0FBL0UsQ0FBUixDQUFkO0FBQWlJLE1BQU1DLG1CQUFtQixHQUFDLENBQUMsTUFBRCxFQUFRLE9BQVIsRUFBZ0IsV0FBaEIsRUFBNEIsWUFBNUIsRUFBeUNQLFNBQXpDLENBQTFCOztBQUE4RSxTQUFTUSxlQUFULENBQXlCQyxHQUF6QixFQUE2QjtBQUFDLFNBQU9BLEdBQUcsQ0FBQ0MsT0FBSixLQUFjVixTQUFyQjtBQUFnQzs7QUFBQSxTQUFTVyxpQkFBVCxDQUEyQkYsR0FBM0IsRUFBK0I7QUFBQyxTQUFPQSxHQUFHLENBQUNBLEdBQUosS0FBVVQsU0FBakI7QUFBNEI7O0FBQUEsU0FBU1ksY0FBVCxDQUF3QkgsR0FBeEIsRUFBNEI7QUFBQyxTQUFPLE9BQU9BLEdBQVAsS0FBYSxRQUFiLEtBQXdCRCxlQUFlLENBQUNDLEdBQUQsQ0FBZixJQUFzQkUsaUJBQWlCLENBQUNGLEdBQUQsQ0FBL0QsQ0FBUDtBQUE4RTs7QUFBQSxNQUFLO0FBQUNJLGFBQVcsRUFBQ0MsaUJBQWI7QUFBK0JDLFlBQVUsRUFBQ0MsZ0JBQTFDO0FBQTJEQyxRQUFNLEVBQUNDLFlBQWxFO0FBQStFQyxNQUFJLEVBQUNDLFVBQXBGO0FBQStGQyxTQUFPLEVBQUNDO0FBQXZHLElBQXNIQyxzSkFBQSxJQUErQjVCLFlBQVksQ0FBQzZCLGtCQUF2SyxDLENBQTBMOztBQUNoMkMsTUFBTUMsUUFBUSxHQUFDLENBQUMsR0FBR1gsaUJBQUosRUFBc0IsR0FBR0UsZ0JBQXpCLENBQWY7QUFBMERGLGlCQUFpQixDQUFDWSxJQUFsQixDQUF1QixDQUFDQyxDQUFELEVBQUdDLENBQUgsS0FBT0QsQ0FBQyxHQUFDQyxDQUFoQztBQUFtQ0gsUUFBUSxDQUFDQyxJQUFULENBQWMsQ0FBQ0MsQ0FBRCxFQUFHQyxDQUFILEtBQU9ELENBQUMsR0FBQ0MsQ0FBdkI7O0FBQTBCLFNBQVNDLFNBQVQsQ0FBbUJDLEtBQW5CLEVBQXlCQyxNQUF6QixFQUFnQ0MsS0FBaEMsRUFBc0M7QUFBQyxNQUFHQSxLQUFLLEtBQUdELE1BQU0sS0FBRyxNQUFULElBQWlCQSxNQUFNLEtBQUcsWUFBN0IsQ0FBUixFQUFtRDtBQUFDO0FBQ2xOLFVBQU1FLGVBQWUsR0FBQyxvQkFBdEI7QUFBMkMsVUFBTUMsWUFBWSxHQUFDLEVBQW5COztBQUFzQixTQUFJLElBQUlDLEtBQVIsRUFBY0EsS0FBSyxHQUFDRixlQUFlLENBQUNHLElBQWhCLENBQXFCSixLQUFyQixDQUFwQixFQUFnREcsS0FBaEQsRUFBc0Q7QUFBQ0Qsa0JBQVksQ0FBQ0csSUFBYixDQUFrQkMsUUFBUSxDQUFDSCxLQUFLLENBQUMsQ0FBRCxDQUFOLENBQTFCO0FBQXVDOztBQUFBLFFBQUdELFlBQVksQ0FBQ0ssTUFBaEIsRUFBdUI7QUFBQyxZQUFNQyxhQUFhLEdBQUNDLElBQUksQ0FBQ0MsR0FBTCxDQUFTLEdBQUdSLFlBQVosSUFBMEIsSUFBOUM7QUFBbUQsYUFBTTtBQUFDUyxjQUFNLEVBQUNsQixRQUFRLENBQUNtQixNQUFULENBQWdCQyxDQUFDLElBQUVBLENBQUMsSUFBRS9CLGlCQUFpQixDQUFDLENBQUQsQ0FBakIsR0FBcUIwQixhQUEzQyxDQUFSO0FBQWtFTSxZQUFJLEVBQUM7QUFBdkUsT0FBTjtBQUFtRjs7QUFBQSxXQUFNO0FBQUNILFlBQU0sRUFBQ2xCLFFBQVI7QUFBaUJxQixVQUFJLEVBQUM7QUFBdEIsS0FBTjtBQUFrQzs7QUFBQSxNQUFHLE9BQU9oQixLQUFQLEtBQWUsUUFBZixJQUF5QkMsTUFBTSxLQUFHLE1BQWxDLElBQTBDQSxNQUFNLEtBQUcsWUFBdEQsRUFBbUU7QUFBQyxXQUFNO0FBQUNZLFlBQU0sRUFBQzdCLGlCQUFSO0FBQTBCZ0MsVUFBSSxFQUFDO0FBQS9CLEtBQU47QUFBMkM7O0FBQUEsUUFBTUgsTUFBTSxHQUFDLENBQUMsR0FBRyxJQUFJSSxHQUFKLEVBQVE7QUFDdmU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFDakIsS0FBRCxFQUFPQSxLQUFLLEdBQUM7QUFBQztBQUFkLElBQStCa0IsR0FBL0IsQ0FBbUNDLENBQUMsSUFBRXhCLFFBQVEsQ0FBQ3lCLElBQVQsQ0FBY0MsQ0FBQyxJQUFFQSxDQUFDLElBQUVGLENBQXBCLEtBQXdCeEIsUUFBUSxDQUFDQSxRQUFRLENBQUNjLE1BQVQsR0FBZ0IsQ0FBakIsQ0FBdEUsQ0FSK2QsQ0FBSixDQUFiO0FBUWpYLFNBQU07QUFBQ0ksVUFBRDtBQUFRRyxRQUFJLEVBQUM7QUFBYixHQUFOO0FBQXlCOztBQUFBLFNBQVNNLGdCQUFULENBQTBCO0FBQUMzQyxLQUFEO0FBQUs0QyxhQUFMO0FBQWlCdEIsUUFBakI7QUFBd0JELE9BQXhCO0FBQThCd0IsU0FBOUI7QUFBc0N0QixPQUF0QztBQUE0Q2Y7QUFBNUMsQ0FBMUIsRUFBOEU7QUFBQyxNQUFHb0MsV0FBSCxFQUFlO0FBQUMsV0FBTTtBQUFDNUMsU0FBRDtBQUFLOEMsWUFBTSxFQUFDdkQsU0FBWjtBQUFzQmdDLFdBQUssRUFBQ2hDO0FBQTVCLEtBQU47QUFBOEM7O0FBQUEsUUFBSztBQUFDMkMsVUFBRDtBQUFRRztBQUFSLE1BQWNqQixTQUFTLENBQUNDLEtBQUQsRUFBT0MsTUFBUCxFQUFjQyxLQUFkLENBQTVCO0FBQWlELFFBQU13QixJQUFJLEdBQUNiLE1BQU0sQ0FBQ0osTUFBUCxHQUFjLENBQXpCO0FBQTJCLFNBQU07QUFBQ1AsU0FBSyxFQUFDLENBQUNBLEtBQUQsSUFBUWMsSUFBSSxLQUFHLEdBQWYsR0FBbUIsT0FBbkIsR0FBMkJkLEtBQWxDO0FBQXdDdUIsVUFBTSxFQUFDWixNQUFNLENBQUNLLEdBQVAsQ0FBVyxDQUFDQyxDQUFELEVBQUdRLENBQUgsS0FBUSxHQUFFeEMsTUFBTSxDQUFDO0FBQUNSLFNBQUQ7QUFBSzZDLGFBQUw7QUFBYXhCLFdBQUssRUFBQ21CO0FBQW5CLEtBQUQsQ0FBd0IsSUFBR0gsSUFBSSxLQUFHLEdBQVAsR0FBV0csQ0FBWCxHQUFhUSxDQUFDLEdBQUMsQ0FBRSxHQUFFWCxJQUFLLEVBQTlFLEVBQWlGWSxJQUFqRixDQUFzRixJQUF0RixDQUEvQztBQUEySTtBQUNoZTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FqRCxPQUFHLEVBQUNRLE1BQU0sQ0FBQztBQUFDUixTQUFEO0FBQUs2QyxhQUFMO0FBQWF4QixXQUFLLEVBQUNhLE1BQU0sQ0FBQ2EsSUFBRDtBQUF6QixLQUFEO0FBTjJVLEdBQU47QUFNaFM7O0FBQUEsU0FBU0csTUFBVCxDQUFnQkMsQ0FBaEIsRUFBa0I7QUFBQyxNQUFHLE9BQU9BLENBQVAsS0FBVyxRQUFkLEVBQXVCO0FBQUMsV0FBT0EsQ0FBUDtBQUFVOztBQUFBLE1BQUcsT0FBT0EsQ0FBUCxLQUFXLFFBQWQsRUFBdUI7QUFBQyxXQUFPdEIsUUFBUSxDQUFDc0IsQ0FBRCxFQUFHLEVBQUgsQ0FBZjtBQUF1Qjs7QUFBQSxTQUFPNUQsU0FBUDtBQUFrQjs7QUFBQSxTQUFTNkQsa0JBQVQsQ0FBNEJDLFdBQTVCLEVBQXdDO0FBQUMsUUFBTUMsSUFBSSxHQUFDOUQsT0FBTyxDQUFDK0QsR0FBUixDQUFZOUMsWUFBWixDQUFYOztBQUFxQyxNQUFHNkMsSUFBSCxFQUFRO0FBQUMsV0FBT0EsSUFBSSxDQUFDLENBQUMsR0FBRXhFLFNBQVMsQ0FBQ21CLE9BQWIsRUFBc0I7QUFBQ3VELFVBQUksRUFBQzdDO0FBQU4sS0FBdEIsRUFBd0MwQyxXQUF4QyxDQUFELENBQVg7QUFBbUU7O0FBQUEsUUFBTSxJQUFJSSxLQUFKLENBQVcseURBQXdEdkUsWUFBWSxDQUFDd0UsYUFBYixDQUEyQlQsSUFBM0IsQ0FBZ0MsSUFBaEMsQ0FBc0MsZUFBY3hDLFlBQWEsRUFBcEksQ0FBTjtBQUE4SSxDLENBQUE7QUFDN2M7OztBQUNBLFNBQVNrRCxpQkFBVCxDQUEyQkMsR0FBM0IsRUFBK0JDLFdBQS9CLEVBQTJDO0FBQUMsTUFBR0EsV0FBVyxLQUFHLE1BQWQsSUFBc0JELEdBQXpCLEVBQTZCO0FBQUMsVUFBTUUsVUFBVSxHQUFDLE1BQUk7QUFBQyxVQUFHLENBQUNGLEdBQUcsQ0FBQzVELEdBQUosQ0FBUStELFVBQVIsQ0FBbUIsT0FBbkIsQ0FBSixFQUFnQztBQUFDLGNBQU1yQixDQUFDLEdBQUMsWUFBV2tCLEdBQVgsR0FBZUEsR0FBRyxDQUFDSSxNQUFKLEVBQWYsR0FBNEJDLE9BQU8sQ0FBQ0MsT0FBUixFQUFwQztBQUFzRHhCLFNBQUMsQ0FBQ3lCLEtBQUYsQ0FBUSxNQUFJLENBQUUsQ0FBZCxFQUFnQkMsSUFBaEIsQ0FBcUIsTUFBSTtBQUFDUixhQUFHLENBQUNTLEtBQUosQ0FBVWxDLE1BQVYsR0FBaUIsTUFBakI7QUFBd0J5QixhQUFHLENBQUNTLEtBQUosQ0FBVUMsY0FBVixHQUF5QixNQUF6QjtBQUFnQ1YsYUFBRyxDQUFDUyxLQUFKLENBQVVFLGVBQVYsR0FBMEIsTUFBMUI7QUFBa0MsU0FBcEg7QUFBdUg7QUFBQyxLQUFyTzs7QUFBc08sUUFBR1gsR0FBRyxDQUFDWSxRQUFQLEVBQWdCO0FBQUM7QUFDalU7QUFDQTtBQUNBVixnQkFBVTtBQUFJLEtBSGtTLE1BRzlSO0FBQUNGLFNBQUcsQ0FBQ2EsTUFBSixHQUFXWCxVQUFYO0FBQXVCO0FBQUM7QUFBQzs7QUFBQSxTQUFTbEYsS0FBVCxDQUFlOEYsSUFBZixFQUFvQjtBQUFDLE1BQUc7QUFBQzFFLE9BQUQ7QUFBS3VCLFNBQUw7QUFBV3FCLGVBQVcsR0FBQyxLQUF2QjtBQUE2QitCLFlBQVEsR0FBQyxLQUF0QztBQUE0Q0MsV0FBNUM7QUFBb0RDLGFBQXBEO0FBQThEaEMsV0FBOUQ7QUFBc0V4QixTQUF0RTtBQUE0RXlELFVBQTVFO0FBQW1GQyxhQUFuRjtBQUE2RkMsa0JBQTdGO0FBQTRHeEUsVUFBTSxHQUFDNEMsa0JBQW5IO0FBQXNJUyxlQUFXLEdBQUMsT0FBbEo7QUFBMEpvQjtBQUExSixNQUF1S1AsSUFBMUs7QUFBQSxNQUErS1EsR0FBRyxHQUFDLENBQUMsR0FBRXJHLDhCQUE4QixDQUFDb0IsT0FBbEMsRUFBMkN5RSxJQUEzQyxFQUFnRCxDQUFDLEtBQUQsRUFBTyxPQUFQLEVBQWUsYUFBZixFQUE2QixVQUE3QixFQUF3QyxTQUF4QyxFQUFrRCxXQUFsRCxFQUE4RCxTQUE5RCxFQUF3RSxPQUF4RSxFQUFnRixRQUFoRixFQUF5RixXQUF6RixFQUFxRyxnQkFBckcsRUFBc0gsUUFBdEgsRUFBK0gsYUFBL0gsRUFBNkksYUFBN0ksQ0FBaEQsQ0FBbkw7QUFBZ1ksTUFBSVMsSUFBSSxHQUFDRCxHQUFUO0FBQWEsTUFBSTVELE1BQU0sR0FBQ0MsS0FBSyxHQUFDLFlBQUQsR0FBYyxXQUE5Qjs7QUFBMEMsTUFBRyxZQUFXNEQsSUFBZCxFQUFtQjtBQUFDO0FBQzVnQixRQUFHQSxJQUFJLENBQUM3RCxNQUFSLEVBQWVBLE1BQU0sR0FBQzZELElBQUksQ0FBQzdELE1BQVosQ0FENGYsQ0FDemU7O0FBQ2xDLFdBQU82RCxJQUFJLENBQUMsUUFBRCxDQUFYO0FBQXVCOztBQUFBLE1BQUlDLFNBQVMsR0FBQyxFQUFkOztBQUFpQixNQUFHakYsY0FBYyxDQUFDSCxHQUFELENBQWpCLEVBQXVCO0FBQUMsVUFBTXFGLGVBQWUsR0FBQ3RGLGVBQWUsQ0FBQ0MsR0FBRCxDQUFmLEdBQXFCQSxHQUFHLENBQUNDLE9BQXpCLEdBQWlDRCxHQUF2RDs7QUFBMkQsUUFBRyxDQUFDcUYsZUFBZSxDQUFDckYsR0FBcEIsRUFBd0I7QUFBQyxZQUFNLElBQUl5RCxLQUFKLENBQVcsOElBQTZJNkIsSUFBSSxDQUFDQyxTQUFMLENBQWVGLGVBQWYsQ0FBZ0MsRUFBeEwsQ0FBTjtBQUFrTTs7QUFBQUosZUFBVyxHQUFDQSxXQUFXLElBQUVJLGVBQWUsQ0FBQ0osV0FBekM7QUFBcURHLGFBQVMsR0FBQ0MsZUFBZSxDQUFDckYsR0FBMUI7O0FBQThCLFFBQUcsQ0FBQ3NCLE1BQUQsSUFBU0EsTUFBTSxLQUFHLE1BQXJCLEVBQTRCO0FBQUN3RCxZQUFNLEdBQUNBLE1BQU0sSUFBRU8sZUFBZSxDQUFDUCxNQUEvQjtBQUFzQ3pELFdBQUssR0FBQ0EsS0FBSyxJQUFFZ0UsZUFBZSxDQUFDaEUsS0FBN0I7O0FBQW1DLFVBQUcsQ0FBQ2dFLGVBQWUsQ0FBQ1AsTUFBakIsSUFBeUIsQ0FBQ08sZUFBZSxDQUFDaEUsS0FBN0MsRUFBbUQ7QUFBQyxjQUFNLElBQUlvQyxLQUFKLENBQVcsMkpBQTBKNkIsSUFBSSxDQUFDQyxTQUFMLENBQWVGLGVBQWYsQ0FBZ0MsRUFBck0sQ0FBTjtBQUErTTtBQUFDO0FBQUM7O0FBQUFyRixLQUFHLEdBQUMsT0FBT0EsR0FBUCxLQUFhLFFBQWIsR0FBc0JBLEdBQXRCLEdBQTBCb0YsU0FBOUI7QUFBd0MsUUFBTUksUUFBUSxHQUFDdEMsTUFBTSxDQUFDN0IsS0FBRCxDQUFyQjtBQUE2QixRQUFNb0UsU0FBUyxHQUFDdkMsTUFBTSxDQUFDNEIsTUFBRCxDQUF0QjtBQUErQixRQUFNWSxVQUFVLEdBQUN4QyxNQUFNLENBQUNMLE9BQUQsQ0FBdkI7O0FBQWlDLFlBQXVDO0FBQUMsUUFBRyxDQUFDN0MsR0FBSixFQUFRO0FBQUMsWUFBTSxJQUFJeUQsS0FBSixDQUFXLDBIQUF5SDZCLElBQUksQ0FBQ0MsU0FBTCxDQUFlO0FBQUNsRSxhQUFEO0FBQU95RCxjQUFQO0FBQWNqQztBQUFkLE9BQWYsQ0FBdUMsRUFBM0ssQ0FBTjtBQUFxTDs7QUFBQSxRQUFHLENBQUMvQyxtQkFBbUIsQ0FBQzZGLFFBQXBCLENBQTZCckUsTUFBN0IsQ0FBSixFQUF5QztBQUFDLFlBQU0sSUFBSW1DLEtBQUosQ0FBVyxtQkFBa0J6RCxHQUFJLDhDQUE2Q3NCLE1BQU8sc0JBQXFCeEIsbUJBQW1CLENBQUN5QyxHQUFwQixDQUF3QnFELE1BQXhCLEVBQWdDM0MsSUFBaEMsQ0FBcUMsR0FBckMsQ0FBMEMsR0FBcEosQ0FBTjtBQUErSjs7QUFBQSxRQUFHLE9BQU91QyxRQUFQLEtBQWtCLFdBQWxCLElBQStCSyxLQUFLLENBQUNMLFFBQUQsQ0FBcEMsSUFBZ0QsT0FBT0MsU0FBUCxLQUFtQixXQUFuQixJQUFnQ0ksS0FBSyxDQUFDSixTQUFELENBQXhGLEVBQW9HO0FBQUMsWUFBTSxJQUFJaEMsS0FBSixDQUFXLG1CQUFrQnpELEdBQUksNkVBQWpDLENBQU47QUFBc0g7O0FBQUEsUUFBRyxDQUFDVixvQkFBb0IsQ0FBQ3FHLFFBQXJCLENBQThCZixPQUE5QixDQUFKLEVBQTJDO0FBQUMsWUFBTSxJQUFJbkIsS0FBSixDQUFXLG1CQUFrQnpELEdBQUksK0NBQThDNEUsT0FBUSxzQkFBcUJ0RixvQkFBb0IsQ0FBQ2lELEdBQXJCLENBQXlCcUQsTUFBekIsRUFBaUMzQyxJQUFqQyxDQUFzQyxHQUF0QyxDQUEyQyxHQUF2SixDQUFOO0FBQWtLOztBQUFBLFFBQUcwQixRQUFRLElBQUVDLE9BQU8sS0FBRyxNQUF2QixFQUE4QjtBQUFDLFlBQU0sSUFBSW5CLEtBQUosQ0FBVyxtQkFBa0J6RCxHQUFJLGlGQUFqQyxDQUFOO0FBQTBIOztBQUFBLFFBQUc2RCxXQUFXLEtBQUcsTUFBakIsRUFBd0I7QUFBQyxVQUFHdkMsTUFBTSxLQUFHLE1BQVQsSUFBaUIsQ0FBQ2tFLFFBQVEsSUFBRSxDQUFYLEtBQWVDLFNBQVMsSUFBRSxDQUExQixJQUE2QixJQUFqRCxFQUFzRDtBQUFDSyxlQUFPLENBQUNDLElBQVIsQ0FBYyxtQkFBa0IvRixHQUFJLHNHQUFwQztBQUE0STs7QUFBQSxVQUFHLENBQUNpRixXQUFKLEVBQWdCO0FBQUMsY0FBTWUsY0FBYyxHQUFDLENBQUMsTUFBRCxFQUFRLEtBQVIsRUFBYyxNQUFkLENBQXJCLENBQUQsQ0FBNEM7O0FBQ2xxRSxjQUFNLElBQUl2QyxLQUFKLENBQVcsbUJBQWtCekQsR0FBSTtBQUN2QztBQUNBO0FBQ0EsbUdBQW1HZ0csY0FBYyxDQUFDL0MsSUFBZixDQUFvQixHQUFwQixDQUF5QjtBQUM1SDtBQUNBLGdGQUxNLENBQU47QUFLbUY7QUFBQztBQUFDOztBQUFBLE1BQUlnRCxNQUFNLEdBQUMsQ0FBQ3RCLFFBQUQsS0FBWUMsT0FBTyxLQUFHLE1BQVYsSUFBa0IsT0FBT0EsT0FBUCxLQUFpQixXQUEvQyxDQUFYOztBQUF1RSxNQUFHNUUsR0FBRyxJQUFFQSxHQUFHLENBQUMrRCxVQUFKLENBQWUsT0FBZixDQUFSLEVBQWdDO0FBQUM7QUFDN0xuQixlQUFXLEdBQUMsSUFBWjtBQUFpQnFELFVBQU0sR0FBQyxLQUFQO0FBQWM7O0FBQUEsUUFBSyxDQUFDQyxNQUFELEVBQVFDLGFBQVIsSUFBdUIsQ0FBQyxHQUFFaEgsZ0JBQWdCLENBQUNpSCxlQUFwQixFQUFxQztBQUFDQyxjQUFVLEVBQUMsT0FBWjtBQUFvQkMsWUFBUSxFQUFDLENBQUNMO0FBQTlCLEdBQXJDLENBQTVCO0FBQXdHLFFBQU1NLFNBQVMsR0FBQyxDQUFDTixNQUFELElBQVNFLGFBQXpCO0FBQXVDLE1BQUlLLFlBQUo7QUFBaUIsTUFBSUMsVUFBSjtBQUFlLE1BQUlDLFFBQUo7QUFBYSxNQUFJQyxRQUFRLEdBQUMsQ0FBQyxHQUFFN0gsU0FBUyxDQUFDbUIsT0FBYixFQUFzQjtBQUFDMkcsWUFBUSxFQUFDLFVBQVY7QUFBcUJDLE9BQUcsRUFBQyxDQUF6QjtBQUEyQkMsUUFBSSxFQUFDLENBQWhDO0FBQWtDQyxVQUFNLEVBQUMsQ0FBekM7QUFBMkNDLFNBQUssRUFBQyxDQUFqRDtBQUFtREMsYUFBUyxFQUFDLFlBQTdEO0FBQTBFQyxXQUFPLEVBQUMsQ0FBbEY7QUFBb0ZDLFVBQU0sRUFBQyxNQUEzRjtBQUFrR0MsVUFBTSxFQUFDLE1BQXpHO0FBQWdIQyxXQUFPLEVBQUMsT0FBeEg7QUFBZ0loRyxTQUFLLEVBQUMsQ0FBdEk7QUFBd0l5RCxVQUFNLEVBQUMsQ0FBL0k7QUFBaUp3QyxZQUFRLEVBQUMsTUFBMUo7QUFBaUtDLFlBQVEsRUFBQyxNQUExSztBQUFpTEMsYUFBUyxFQUFDLE1BQTNMO0FBQWtNQyxhQUFTLEVBQUMsTUFBNU07QUFBbU4xQyxhQUFuTjtBQUE2TkM7QUFBN04sR0FBdEIsRUFBbVFuQixXQUFXLEtBQUcsTUFBZCxHQUFxQjtBQUFDMUIsVUFBTSxFQUFDLFlBQVI7QUFBcUJtQyxrQkFBYyxFQUFDLE9BQXBDO0FBQTRDQyxtQkFBZSxFQUFFLFFBQU9VLFdBQVk7QUFBaEYsR0FBckIsR0FBMEcxRixTQUE3VyxDQUFiOztBQUFxWSxNQUFHLE9BQU9pRyxRQUFQLEtBQWtCLFdBQWxCLElBQStCLE9BQU9DLFNBQVAsS0FBbUIsV0FBbEQsSUFBK0RuRSxNQUFNLEtBQUcsTUFBM0UsRUFBa0Y7QUFBQztBQUNuckIsVUFBTW9HLFFBQVEsR0FBQ2pDLFNBQVMsR0FBQ0QsUUFBekI7QUFBa0MsVUFBTW1DLFVBQVUsR0FBQzlCLEtBQUssQ0FBQzZCLFFBQUQsQ0FBTCxHQUFnQixNQUFoQixHQUF3QixHQUFFQSxRQUFRLEdBQUMsR0FBSSxHQUF4RDs7QUFBMkQsUUFBR3BHLE1BQU0sS0FBRyxZQUFaLEVBQXlCO0FBQUM7QUFDdkhrRixrQkFBWSxHQUFDO0FBQUNhLGVBQU8sRUFBQyxPQUFUO0FBQWlCTyxnQkFBUSxFQUFDLFFBQTFCO0FBQW1DaEIsZ0JBQVEsRUFBQyxVQUE1QztBQUF1REssaUJBQVMsRUFBQyxZQUFqRTtBQUE4RUcsY0FBTSxFQUFDO0FBQXJGLE9BQWI7QUFBcUdYLGdCQUFVLEdBQUM7QUFBQ1ksZUFBTyxFQUFDLE9BQVQ7QUFBaUJKLGlCQUFTLEVBQUMsWUFBM0I7QUFBd0NVO0FBQXhDLE9BQVg7QUFBZ0UsS0FEeEUsTUFDNkUsSUFBR3JHLE1BQU0sS0FBRyxXQUFaLEVBQXdCO0FBQUM7QUFDbk1rRixrQkFBWSxHQUFDO0FBQUNhLGVBQU8sRUFBQyxjQUFUO0FBQXdCRSxnQkFBUSxFQUFDLE1BQWpDO0FBQXdDSyxnQkFBUSxFQUFDLFFBQWpEO0FBQTBEaEIsZ0JBQVEsRUFBQyxVQUFuRTtBQUE4RUssaUJBQVMsRUFBQyxZQUF4RjtBQUFxR0csY0FBTSxFQUFDO0FBQTVHLE9BQWI7QUFBNEhYLGdCQUFVLEdBQUM7QUFBQ1EsaUJBQVMsRUFBQyxZQUFYO0FBQXdCSSxlQUFPLEVBQUMsT0FBaEM7QUFBd0NFLGdCQUFRLEVBQUM7QUFBakQsT0FBWDtBQUFvRWIsY0FBUSxHQUFFLGVBQWNsQixRQUFTLGFBQVlDLFNBQVUsc0RBQXZEO0FBQThHLEtBRHBJLE1BQ3lJLElBQUduRSxNQUFNLEtBQUcsT0FBWixFQUFvQjtBQUFDO0FBQ3hVa0Ysa0JBQVksR0FBQztBQUFDb0IsZ0JBQVEsRUFBQyxRQUFWO0FBQW1CWCxpQkFBUyxFQUFDLFlBQTdCO0FBQTBDSSxlQUFPLEVBQUMsY0FBbEQ7QUFBaUVULGdCQUFRLEVBQUMsVUFBMUU7QUFBcUZ2RixhQUFLLEVBQUNtRSxRQUEzRjtBQUFvR1YsY0FBTSxFQUFDVztBQUEzRyxPQUFiO0FBQW9JO0FBQUMsR0FKMmQsTUFJdGQsSUFBRyxPQUFPRCxRQUFQLEtBQWtCLFdBQWxCLElBQStCLE9BQU9DLFNBQVAsS0FBbUIsV0FBbEQsSUFBK0RuRSxNQUFNLEtBQUcsTUFBM0UsRUFBa0Y7QUFBQztBQUM3TmtGLGdCQUFZLEdBQUM7QUFBQ2EsYUFBTyxFQUFDLE9BQVQ7QUFBaUJPLGNBQVEsRUFBQyxRQUExQjtBQUFtQ2hCLGNBQVEsRUFBQyxVQUE1QztBQUF1REMsU0FBRyxFQUFDLENBQTNEO0FBQTZEQyxVQUFJLEVBQUMsQ0FBbEU7QUFBb0VDLFlBQU0sRUFBQyxDQUEzRTtBQUE2RUMsV0FBSyxFQUFDLENBQW5GO0FBQXFGQyxlQUFTLEVBQUMsWUFBL0Y7QUFBNEdHLFlBQU0sRUFBQztBQUFuSCxLQUFiO0FBQW9JLEdBRE0sTUFDRjtBQUFDO0FBQ3pJLGNBQXVDO0FBQUMsWUFBTSxJQUFJM0QsS0FBSixDQUFXLG1CQUFrQnpELEdBQUkseUVBQWpDLENBQU47QUFBa0g7QUFBQzs7QUFBQSxNQUFJNkgsYUFBYSxHQUFDO0FBQUM3SCxPQUFHLEVBQUMsZ0ZBQUw7QUFBc0Y4QyxVQUFNLEVBQUN2RCxTQUE3RjtBQUF1R2dDLFNBQUssRUFBQ2hDO0FBQTdHLEdBQWxCOztBQUEwSSxNQUFHZ0gsU0FBSCxFQUFhO0FBQUNzQixpQkFBYSxHQUFDbEYsZ0JBQWdCLENBQUM7QUFBQzNDLFNBQUQ7QUFBSzRDLGlCQUFMO0FBQWlCdEIsWUFBakI7QUFBd0JELFdBQUssRUFBQ21FLFFBQTlCO0FBQXVDM0MsYUFBTyxFQUFDNkMsVUFBL0M7QUFBMERuRSxXQUExRDtBQUFnRWY7QUFBaEUsS0FBRCxDQUE5QjtBQUF5Rzs7QUFBQSxTQUFNLGFBQWF6QixNQUFNLENBQUNrQixPQUFQLENBQWU2SCxhQUFmLENBQTZCLEtBQTdCLEVBQW1DO0FBQUN6RCxTQUFLLEVBQUNtQztBQUFQLEdBQW5DLEVBQXdEQyxVQUFVLEdBQUMsYUFBYTFILE1BQU0sQ0FBQ2tCLE9BQVAsQ0FBZTZILGFBQWYsQ0FBNkIsS0FBN0IsRUFBbUM7QUFBQ3pELFNBQUssRUFBQ29DO0FBQVAsR0FBbkMsRUFBc0RDLFFBQVEsR0FBQyxhQUFhM0gsTUFBTSxDQUFDa0IsT0FBUCxDQUFlNkgsYUFBZixDQUE2QixLQUE3QixFQUFtQztBQUFDekQsU0FBSyxFQUFDO0FBQUNrRCxjQUFRLEVBQUMsTUFBVjtBQUFpQkYsYUFBTyxFQUFDLE9BQXpCO0FBQWlDRCxZQUFNLEVBQUMsQ0FBeEM7QUFBMENELFlBQU0sRUFBQyxNQUFqRDtBQUF3REQsYUFBTyxFQUFDO0FBQWhFLEtBQVA7QUFBMEVhLE9BQUcsRUFBQyxFQUE5RTtBQUFpRixtQkFBYyxJQUEvRjtBQUFvR0MsUUFBSSxFQUFDLGNBQXpHO0FBQXdIaEksT0FBRyxFQUFFLDZCQUE0QixDQUFDLEdBQUVmLE9BQU8sQ0FBQ2dKLFFBQVgsRUFBcUJ2QixRQUFyQixDQUErQjtBQUF4TCxHQUFuQyxDQUFkLEdBQTZPLElBQTNTLENBQWQsR0FBK1QsSUFBalksRUFBc1ksQ0FBQ0gsU0FBRCxJQUFZLGFBQWF4SCxNQUFNLENBQUNrQixPQUFQLENBQWU2SCxhQUFmLENBQTZCLFVBQTdCLEVBQXdDLElBQXhDLEVBQTZDLGFBQWEvSSxNQUFNLENBQUNrQixPQUFQLENBQWU2SCxhQUFmLENBQTZCLEtBQTdCLEVBQW1DSSxNQUFNLENBQUNDLE1BQVAsQ0FBYyxFQUFkLEVBQWlCaEQsSUFBakIsRUFBc0J4QyxnQkFBZ0IsQ0FBQztBQUFDM0MsT0FBRDtBQUFLNEMsZUFBTDtBQUFpQnRCLFVBQWpCO0FBQXdCRCxTQUFLLEVBQUNtRSxRQUE5QjtBQUF1QzNDLFdBQU8sRUFBQzZDLFVBQS9DO0FBQTBEbkUsU0FBMUQ7QUFBZ0VmO0FBQWhFLEdBQUQsQ0FBdEMsRUFBZ0g7QUFBQzRILFlBQVEsRUFBQyxPQUFWO0FBQWtCL0QsU0FBSyxFQUFDc0MsUUFBeEI7QUFBaUM5QixhQUFTLEVBQUNBO0FBQTNDLEdBQWhILENBQW5DLENBQTFELENBQS9aLEVBQXFxQixhQUFhOUYsTUFBTSxDQUFDa0IsT0FBUCxDQUFlNkgsYUFBZixDQUE2QixLQUE3QixFQUFtQ0ksTUFBTSxDQUFDQyxNQUFQLENBQWMsRUFBZCxFQUFpQmhELElBQWpCLEVBQXNCMEMsYUFBdEIsRUFBb0M7QUFBQ08sWUFBUSxFQUFDLE9BQVY7QUFBa0J2RCxhQUFTLEVBQUNBLFNBQTVCO0FBQXNDd0QsT0FBRyxFQUFDQyxPQUFPLElBQUU7QUFBQ3BDLFlBQU0sQ0FBQ29DLE9BQUQsQ0FBTjtBQUFnQjNFLHVCQUFpQixDQUFDMkUsT0FBRCxFQUFTekUsV0FBVCxDQUFqQjtBQUF3QyxLQUE1RztBQUE2R1EsU0FBSyxFQUFDc0M7QUFBbkgsR0FBcEMsQ0FBbkMsQ0FBbHJCLEVBQXczQmhDLFFBQVE7QUFBQztBQUFjO0FBQzl6QztBQUNBO0FBQ0E7QUFDQTtBQUNBNUYsUUFBTSxDQUFDa0IsT0FBUCxDQUFlNkgsYUFBZixDQUE2QjlJLEtBQUssQ0FBQ2lCLE9BQW5DLEVBQTJDLElBQTNDLEVBQWdELGFBQWFsQixNQUFNLENBQUNrQixPQUFQLENBQWU2SCxhQUFmLENBQTZCLE1BQTdCLEVBQW9DO0FBQUNTLE9BQUcsRUFBQyxZQUFVVixhQUFhLENBQUM3SCxHQUF4QixHQUE0QjZILGFBQWEsQ0FBQy9FLE1BQTFDLEdBQWlEK0UsYUFBYSxDQUFDdEcsS0FBcEU7QUFBMEVpSCxPQUFHLEVBQUMsU0FBOUU7QUFBd0ZDLE1BQUUsRUFBQyxPQUEzRjtBQUFtR0MsUUFBSSxFQUFDYixhQUFhLENBQUMvRSxNQUFkLEdBQXFCdkQsU0FBckIsR0FBK0JzSSxhQUFhLENBQUM3SCxHQUFySixDQUF3SjtBQUF4SjtBQUNoRzJJLGVBQVcsRUFBQ2QsYUFBYSxDQUFDL0UsTUFEc0UsQ0FDaEU7QUFEZ0U7QUFFaEc4RixjQUFVLEVBQUNmLGFBQWEsQ0FBQ3RHO0FBRnVFLEdBQXBDLENBQTdELENBTCt5QyxHQU81d0MsSUFQNFksQ0FBbkI7QUFPbFgsQyxDQUFBOzs7QUFDMUMsU0FBU3NILFlBQVQsQ0FBc0I3SSxHQUF0QixFQUEwQjtBQUFDLFNBQU9BLEdBQUcsQ0FBQyxDQUFELENBQUgsS0FBUyxHQUFULEdBQWFBLEdBQUcsQ0FBQzhJLEtBQUosQ0FBVSxDQUFWLENBQWIsR0FBMEI5SSxHQUFqQztBQUFzQzs7QUFBQSxTQUFTTixXQUFULENBQXFCO0FBQUM4RCxNQUFEO0FBQU14RCxLQUFOO0FBQVVxQixPQUFWO0FBQWdCd0I7QUFBaEIsQ0FBckIsRUFBOEM7QUFBQztBQUNoSCxRQUFNa0csTUFBTSxHQUFDLENBQUMsYUFBRCxFQUFlLFNBQWYsRUFBeUIsT0FBSzFILEtBQTlCLENBQWI7QUFBa0QsTUFBSTJILFlBQVksR0FBQyxFQUFqQjs7QUFBb0IsTUFBR25HLE9BQUgsRUFBVztBQUFDa0csVUFBTSxDQUFDbkgsSUFBUCxDQUFZLE9BQUtpQixPQUFqQjtBQUEyQjs7QUFBQSxNQUFHa0csTUFBTSxDQUFDakgsTUFBVixFQUFpQjtBQUFDa0gsZ0JBQVksR0FBQyxNQUFJRCxNQUFNLENBQUM5RixJQUFQLENBQVksR0FBWixDQUFqQjtBQUFtQzs7QUFBQSxTQUFPLEdBQUVPLElBQUssR0FBRXFGLFlBQVksQ0FBQzdJLEdBQUQsQ0FBTSxHQUFFZ0osWUFBYSxFQUFqRDtBQUFvRDs7QUFBQSxTQUFTcEosWUFBVCxDQUFzQjtBQUFDNEQsTUFBRDtBQUFNeEQsS0FBTjtBQUFVcUI7QUFBVixDQUF0QixFQUF1QztBQUFDLFNBQU8sR0FBRW1DLElBQUssR0FBRXFGLFlBQVksQ0FBQzdJLEdBQUQsQ0FBTSxZQUFXcUIsS0FBTSxFQUFuRDtBQUFzRDs7QUFBQSxTQUFTMUIsZ0JBQVQsQ0FBMEI7QUFBQzZELE1BQUQ7QUFBTXhELEtBQU47QUFBVXFCLE9BQVY7QUFBZ0J3QjtBQUFoQixDQUExQixFQUFtRDtBQUFDO0FBQ3hXLFFBQU1rRyxNQUFNLEdBQUMsQ0FBQyxRQUFELEVBQVUsU0FBVixFQUFvQixPQUFLMUgsS0FBekIsRUFBK0IsUUFBTXdCLE9BQU8sSUFBRSxNQUFmLENBQS9CLENBQWI7QUFBb0UsTUFBSW1HLFlBQVksR0FBQ0QsTUFBTSxDQUFDOUYsSUFBUCxDQUFZLEdBQVosSUFBaUIsR0FBbEM7QUFBc0MsU0FBTyxHQUFFTyxJQUFLLEdBQUV3RixZQUFhLEdBQUVILFlBQVksQ0FBQzdJLEdBQUQsQ0FBTSxFQUFqRDtBQUFvRDs7QUFBQSxTQUFTSCxhQUFULENBQXVCO0FBQUMyRCxNQUFEO0FBQU14RCxLQUFOO0FBQVVxQixPQUFWO0FBQWdCd0I7QUFBaEIsQ0FBdkIsRUFBZ0Q7QUFBQyxZQUF1QztBQUFDLFVBQU1vRyxhQUFhLEdBQUMsRUFBcEIsQ0FBRCxDQUF3Qjs7QUFDOVEsUUFBRyxDQUFDakosR0FBSixFQUFRaUosYUFBYSxDQUFDckgsSUFBZCxDQUFtQixLQUFuQjtBQUEwQixRQUFHLENBQUNQLEtBQUosRUFBVTRILGFBQWEsQ0FBQ3JILElBQWQsQ0FBbUIsT0FBbkI7O0FBQTRCLFFBQUdxSCxhQUFhLENBQUNuSCxNQUFkLEdBQXFCLENBQXhCLEVBQTBCO0FBQUMsWUFBTSxJQUFJMkIsS0FBSixDQUFXLG9DQUFtQ3dGLGFBQWEsQ0FBQ2hHLElBQWQsQ0FBbUIsSUFBbkIsQ0FBeUIsZ0dBQStGcUMsSUFBSSxDQUFDQyxTQUFMLENBQWU7QUFBQ3ZGLFdBQUQ7QUFBS3FCLGFBQUw7QUFBV3dCO0FBQVgsT0FBZixDQUFvQyxFQUExTSxDQUFOO0FBQW9OOztBQUFBLFFBQUc3QyxHQUFHLENBQUMrRCxVQUFKLENBQWUsSUFBZixDQUFILEVBQXdCO0FBQUMsWUFBTSxJQUFJTixLQUFKLENBQVcsd0JBQXVCekQsR0FBSSwwR0FBdEMsQ0FBTjtBQUF3Sjs7QUFBQSxRQUFHLENBQUNBLEdBQUcsQ0FBQytELFVBQUosQ0FBZSxHQUFmLENBQUQsSUFBc0JsRCxhQUF6QixFQUF1QztBQUFDLFVBQUlxSSxTQUFKOztBQUFjLFVBQUc7QUFBQ0EsaUJBQVMsR0FBQyxJQUFJQyxHQUFKLENBQVFuSixHQUFSLENBQVY7QUFBd0IsT0FBNUIsQ0FBNEIsT0FBTW9KLEdBQU4sRUFBVTtBQUFDdEQsZUFBTyxDQUFDdUQsS0FBUixDQUFjRCxHQUFkO0FBQW1CLGNBQU0sSUFBSTNGLEtBQUosQ0FBVyx3QkFBdUJ6RCxHQUFJLGlJQUF0QyxDQUFOO0FBQStLOztBQUFBLFVBQUcsQ0FBQ2EsYUFBYSxDQUFDOEUsUUFBZCxDQUF1QnVELFNBQVMsQ0FBQ0ksUUFBakMsQ0FBSixFQUErQztBQUFDLGNBQU0sSUFBSTdGLEtBQUosQ0FBVyxxQkFBb0J6RCxHQUFJLGtDQUFpQ2tKLFNBQVMsQ0FBQ0ksUUFBUywrREFBN0UsR0FBNkksOEVBQXZKLENBQU47QUFBNk87QUFBQztBQUFDOztBQUFBLFNBQU8sR0FBRTlGLElBQUssUUFBTytGLGtCQUFrQixDQUFDdkosR0FBRCxDQUFNLE1BQUtxQixLQUFNLE1BQUt3QixPQUFPLElBQUUsRUFBRyxFQUF6RTtBQUE0RSxDOzs7Ozs7Ozs7OztBQy9Dcm1DOztBQUFBLElBQUkyRyx1QkFBdUIsR0FBQzlLLG1CQUFPLENBQUMsd0lBQUQsQ0FBbkM7O0FBQXFGQyxrQkFBQSxHQUFtQixJQUFuQjtBQUF3QkEsZUFBQSxHQUFnQixLQUFLLENBQXJCOztBQUF1QixJQUFJSSxNQUFNLEdBQUN5Syx1QkFBdUIsQ0FBQzlLLG1CQUFPLENBQUMsb0JBQUQsQ0FBUixDQUFsQzs7QUFBcUQsSUFBSStLLE9BQU8sR0FBQy9LLG1CQUFPLENBQUMsbUdBQUQsQ0FBbkI7O0FBQXdELElBQUlnTCxRQUFRLEdBQUNoTCxtQkFBTyxDQUFDLDJEQUFELENBQXBCOztBQUFpQyxJQUFJUyxnQkFBZ0IsR0FBQ1QsbUJBQU8sQ0FBQywrRUFBRCxDQUE1Qjs7QUFBbUQsTUFBTWlMLFVBQVUsR0FBQyxFQUFqQjs7QUFBb0IsU0FBU0MsUUFBVCxDQUFrQkMsTUFBbEIsRUFBeUJuQixJQUF6QixFQUE4QkQsRUFBOUIsRUFBaUNxQixPQUFqQyxFQUF5QztBQUFDLE1BQUcsSUFBSCxFQUF3QztBQUFPLE1BQUcsQ0FBQyxDQUFDLEdBQUVMLE9BQU8sQ0FBQ00sVUFBWCxFQUF1QnJCLElBQXZCLENBQUosRUFBaUMsT0FBakYsQ0FBd0Y7QUFDdmU7QUFDQTtBQUNBOztBQUNBbUIsUUFBTSxDQUFDRCxRQUFQLENBQWdCbEIsSUFBaEIsRUFBcUJELEVBQXJCLEVBQXdCcUIsT0FBeEIsRUFBaUMzRixLQUFqQyxDQUF1Q2lGLEdBQUcsSUFBRTtBQUFDLGNBQXVDO0FBQUM7QUFDckYsWUFBTUEsR0FBTjtBQUFXO0FBQUMsR0FEWjtBQUNjLFFBQU1ZLFNBQVMsR0FBQ0YsT0FBTyxJQUFFLE9BQU9BLE9BQU8sQ0FBQ0csTUFBZixLQUF3QixXQUFqQyxHQUE2Q0gsT0FBTyxDQUFDRyxNQUFyRCxHQUE0REosTUFBTSxJQUFFQSxNQUFNLENBQUNJLE1BQTNGLENBTGlZLENBSy9SOztBQUNoSE4sWUFBVSxDQUFDakIsSUFBSSxHQUFDLEdBQUwsR0FBU0QsRUFBVCxJQUFhdUIsU0FBUyxHQUFDLE1BQUlBLFNBQUwsR0FBZSxFQUFyQyxDQUFELENBQVYsR0FBcUQsSUFBckQ7QUFBMkQ7O0FBQUEsU0FBU0UsZUFBVCxDQUF5QkMsS0FBekIsRUFBK0I7QUFBQyxRQUFLO0FBQUNDO0FBQUQsTUFBU0QsS0FBSyxDQUFDRSxhQUFwQjtBQUFrQyxTQUFPRCxNQUFNLElBQUVBLE1BQU0sS0FBRyxPQUFqQixJQUEwQkQsS0FBSyxDQUFDRyxPQUFoQyxJQUF5Q0gsS0FBSyxDQUFDSSxPQUEvQyxJQUF3REosS0FBSyxDQUFDSyxRQUE5RCxJQUF3RUwsS0FBSyxDQUFDTSxNQUE5RSxJQUFzRjtBQUMxTk4sT0FBSyxDQUFDTyxXQUFOLElBQW1CUCxLQUFLLENBQUNPLFdBQU4sQ0FBa0JDLEtBQWxCLEtBQTBCLENBRGdGO0FBQzdFOztBQUFBLFNBQVNDLFdBQVQsQ0FBcUJDLENBQXJCLEVBQXVCaEIsTUFBdkIsRUFBOEJuQixJQUE5QixFQUFtQ0QsRUFBbkMsRUFBc0NxQyxPQUF0QyxFQUE4Q0MsT0FBOUMsRUFBc0RDLE1BQXRELEVBQTZEZixNQUE3RCxFQUFvRTtBQUFDLFFBQUs7QUFBQ2dCO0FBQUQsTUFBV0osQ0FBQyxDQUFDUixhQUFsQjs7QUFBZ0MsTUFBR1ksUUFBUSxLQUFHLEdBQVgsS0FBaUJmLGVBQWUsQ0FBQ1csQ0FBRCxDQUFmLElBQW9CLENBQUMsQ0FBQyxHQUFFcEIsT0FBTyxDQUFDTSxVQUFYLEVBQXVCckIsSUFBdkIsQ0FBdEMsQ0FBSCxFQUF1RTtBQUFDO0FBQzdOO0FBQVE7O0FBQUFtQyxHQUFDLENBQUNLLGNBQUYsR0FENEcsQ0FDekY7O0FBQzNCLE1BQUdGLE1BQU0sSUFBRSxJQUFSLElBQWN2QyxFQUFFLENBQUMwQyxPQUFILENBQVcsR0FBWCxLQUFpQixDQUFsQyxFQUFvQztBQUFDSCxVQUFNLEdBQUMsS0FBUDtBQUFjLEdBRmlFLENBRWpFOzs7QUFDbkRuQixRQUFNLENBQUNpQixPQUFPLEdBQUMsU0FBRCxHQUFXLE1BQW5CLENBQU4sQ0FBaUNwQyxJQUFqQyxFQUFzQ0QsRUFBdEMsRUFBeUM7QUFBQ3NDLFdBQUQ7QUFBU2QsVUFBVDtBQUFnQmU7QUFBaEIsR0FBekM7QUFBbUU7O0FBQUEsU0FBU0ksSUFBVCxDQUFjQyxLQUFkLEVBQW9CO0FBQUMsWUFBdUM7QUFBQyxhQUFTQyxlQUFULENBQXlCQyxJQUF6QixFQUE4QjtBQUFDLGFBQU8sSUFBSTlILEtBQUosQ0FBVyxnQ0FBK0I4SCxJQUFJLENBQUNoRCxHQUFJLGdCQUFlZ0QsSUFBSSxDQUFDQyxRQUFTLDZCQUE0QkQsSUFBSSxDQUFDRSxNQUFPLGFBQTlHLElBQTRILFNBQTRCLENBQTVCLEdBQStGLEVBQTNOLENBQVYsQ0FBUDtBQUFrUCxLQUFsUixDQUFrUjs7O0FBQ2paLFVBQU1DLGtCQUFrQixHQUFDO0FBQUNoRCxVQUFJLEVBQUM7QUFBTixLQUF6QjtBQUFxQyxVQUFNaUQsYUFBYSxHQUFDekQsTUFBTSxDQUFDMEQsSUFBUCxDQUFZRixrQkFBWixDQUFwQjtBQUFvREMsaUJBQWEsQ0FBQ0UsT0FBZCxDQUFzQnRELEdBQUcsSUFBRTtBQUFDLFVBQUdBLEdBQUcsS0FBRyxNQUFULEVBQWdCO0FBQUMsWUFBRzhDLEtBQUssQ0FBQzlDLEdBQUQsQ0FBTCxJQUFZLElBQVosSUFBa0IsT0FBTzhDLEtBQUssQ0FBQzlDLEdBQUQsQ0FBWixLQUFvQixRQUFwQixJQUE4QixPQUFPOEMsS0FBSyxDQUFDOUMsR0FBRCxDQUFaLEtBQW9CLFFBQXZFLEVBQWdGO0FBQUMsZ0JBQU0rQyxlQUFlLENBQUM7QUFBQy9DLGVBQUQ7QUFBS2lELG9CQUFRLEVBQUMsc0JBQWQ7QUFBcUNDLGtCQUFNLEVBQUNKLEtBQUssQ0FBQzlDLEdBQUQsQ0FBTCxLQUFhLElBQWIsR0FBa0IsTUFBbEIsR0FBeUIsT0FBTzhDLEtBQUssQ0FBQzlDLEdBQUQ7QUFBakYsV0FBRCxDQUFyQjtBQUFnSDtBQUFDLE9BQW5OLE1BQXVOO0FBQUM7QUFDN1U7QUFDQSxjQUFNdUQsQ0FBQyxHQUFDdkQsR0FBUjtBQUFhO0FBQUMsS0FGMkUsRUFEc0MsQ0FHL0c7O0FBQ2hCLFVBQU13RCxrQkFBa0IsR0FBQztBQUFDdEQsUUFBRSxFQUFDLElBQUo7QUFBU3FDLGFBQU8sRUFBQyxJQUFqQjtBQUFzQkUsWUFBTSxFQUFDLElBQTdCO0FBQWtDRCxhQUFPLEVBQUMsSUFBMUM7QUFBK0NpQixjQUFRLEVBQUMsSUFBeEQ7QUFBNkRwQyxjQUFRLEVBQUMsSUFBdEU7QUFBMkVLLFlBQU0sRUFBQztBQUFsRixLQUF6QjtBQUFpSCxVQUFNZ0MsYUFBYSxHQUFDL0QsTUFBTSxDQUFDMEQsSUFBUCxDQUFZRyxrQkFBWixDQUFwQjtBQUFvREUsaUJBQWEsQ0FBQ0osT0FBZCxDQUFzQnRELEdBQUcsSUFBRTtBQUFDLFlBQU0yRCxPQUFPLEdBQUMsT0FBT2IsS0FBSyxDQUFDOUMsR0FBRCxDQUExQjs7QUFBZ0MsVUFBR0EsR0FBRyxLQUFHLElBQVQsRUFBYztBQUFDLFlBQUc4QyxLQUFLLENBQUM5QyxHQUFELENBQUwsSUFBWTJELE9BQU8sS0FBRyxRQUF0QixJQUFnQ0EsT0FBTyxLQUFHLFFBQTdDLEVBQXNEO0FBQUMsZ0JBQU1aLGVBQWUsQ0FBQztBQUFDL0MsZUFBRDtBQUFLaUQsb0JBQVEsRUFBQyxzQkFBZDtBQUFxQ0Msa0JBQU0sRUFBQ1M7QUFBNUMsV0FBRCxDQUFyQjtBQUE2RTtBQUFDLE9BQXBKLE1BQXlKLElBQUczRCxHQUFHLEtBQUcsUUFBVCxFQUFrQjtBQUFDLFlBQUc4QyxLQUFLLENBQUM5QyxHQUFELENBQUwsSUFBWTJELE9BQU8sS0FBRyxRQUF6QixFQUFrQztBQUFDLGdCQUFNWixlQUFlLENBQUM7QUFBQy9DLGVBQUQ7QUFBS2lELG9CQUFRLEVBQUMsVUFBZDtBQUF5QkMsa0JBQU0sRUFBQ1M7QUFBaEMsV0FBRCxDQUFyQjtBQUFpRTtBQUFDLE9BQXhILE1BQTZILElBQUczRCxHQUFHLEtBQUcsU0FBTixJQUFpQkEsR0FBRyxLQUFHLFFBQXZCLElBQWlDQSxHQUFHLEtBQUcsU0FBdkMsSUFBa0RBLEdBQUcsS0FBRyxVQUF4RCxJQUFvRUEsR0FBRyxLQUFHLFVBQTdFLEVBQXdGO0FBQUMsWUFBRzhDLEtBQUssQ0FBQzlDLEdBQUQsQ0FBTCxJQUFZLElBQVosSUFBa0IyRCxPQUFPLEtBQUcsU0FBL0IsRUFBeUM7QUFBQyxnQkFBTVosZUFBZSxDQUFDO0FBQUMvQyxlQUFEO0FBQUtpRCxvQkFBUSxFQUFDLFdBQWQ7QUFBMEJDLGtCQUFNLEVBQUNTO0FBQWpDLFdBQUQsQ0FBckI7QUFBa0U7QUFBQyxPQUF0TSxNQUEwTTtBQUFDO0FBQ2xzQjtBQUNBLGNBQU1KLENBQUMsR0FBQ3ZELEdBQVI7QUFBYTtBQUFDLEtBRnVKLEVBSnRDLENBTS9HO0FBQ2hCOztBQUNBLFVBQU00RCxTQUFTLEdBQUNwTixNQUFNLENBQUNrQixPQUFQLENBQWVtTSxNQUFmLENBQXNCLEtBQXRCLENBQWhCOztBQUE2QyxRQUFHZixLQUFLLENBQUN6QixRQUFOLElBQWdCLENBQUN1QyxTQUFTLENBQUNFLE9BQTlCLEVBQXNDO0FBQUNGLGVBQVMsQ0FBQ0UsT0FBVixHQUFrQixJQUFsQjtBQUF1QnZHLGFBQU8sQ0FBQ0MsSUFBUixDQUFhLHNLQUFiO0FBQXNMO0FBQUM7O0FBQUEsUUFBTXJELENBQUMsR0FBQzJJLEtBQUssQ0FBQ3pCLFFBQU4sS0FBaUIsS0FBekI7QUFBK0IsUUFBTUMsTUFBTSxHQUFDLENBQUMsR0FBRUgsUUFBUSxDQUFDNEMsU0FBWixHQUFiOztBQUFzQyxRQUFLO0FBQUM1RCxRQUFEO0FBQU1EO0FBQU4sTUFBVTFKLE1BQU0sQ0FBQ2tCLE9BQVAsQ0FBZXNNLE9BQWYsQ0FBdUIsTUFBSTtBQUFDLFVBQUssQ0FBQ0MsWUFBRCxFQUFjQyxVQUFkLElBQTBCLENBQUMsR0FBRWhELE9BQU8sQ0FBQ2lELFdBQVgsRUFBd0I3QyxNQUF4QixFQUErQndCLEtBQUssQ0FBQzNDLElBQXJDLEVBQTBDLElBQTFDLENBQS9CO0FBQStFLFdBQU07QUFBQ0EsVUFBSSxFQUFDOEQsWUFBTjtBQUFtQi9ELFFBQUUsRUFBQzRDLEtBQUssQ0FBQzVDLEVBQU4sR0FBUyxDQUFDLEdBQUVnQixPQUFPLENBQUNpRCxXQUFYLEVBQXdCN0MsTUFBeEIsRUFBK0J3QixLQUFLLENBQUM1QyxFQUFyQyxDQUFULEdBQWtEZ0UsVUFBVSxJQUFFRDtBQUFwRixLQUFOO0FBQXlHLEdBQXBOLEVBQXFOLENBQUMzQyxNQUFELEVBQVF3QixLQUFLLENBQUMzQyxJQUFkLEVBQW1CMkMsS0FBSyxDQUFDNUMsRUFBekIsQ0FBck4sQ0FBZjs7QUFBa1EsTUFBRztBQUFDa0UsWUFBRDtBQUFVN0IsV0FBVjtBQUFrQkMsV0FBbEI7QUFBMEJDLFVBQTFCO0FBQWlDZjtBQUFqQyxNQUF5Q29CLEtBQTVDLENBUmxoQixDQVFva0I7O0FBQzNwQixNQUFHLE9BQU9zQixRQUFQLEtBQWtCLFFBQXJCLEVBQThCO0FBQUNBLFlBQVEsR0FBQyxhQUFhNU4sTUFBTSxDQUFDa0IsT0FBUCxDQUFlNkgsYUFBZixDQUE2QixHQUE3QixFQUFpQyxJQUFqQyxFQUFzQzZFLFFBQXRDLENBQXRCO0FBQXVFLEdBVGYsQ0FTZTs7O0FBQ3RHLE1BQUlDLEtBQUo7O0FBQVUsWUFBd0M7QUFBQyxRQUFHO0FBQUNBLFdBQUssR0FBQzdOLE1BQU0sQ0FBQzhOLFFBQVAsQ0FBZ0JDLElBQWhCLENBQXFCSCxRQUFyQixDQUFOO0FBQXNDLEtBQTFDLENBQTBDLE9BQU12RCxHQUFOLEVBQVU7QUFBQyxZQUFNLElBQUkzRixLQUFKLENBQVcsOERBQTZENEgsS0FBSyxDQUFDM0MsSUFBSyw0RkFBekUsSUFBc0ssU0FBNEIsQ0FBNUIsR0FBK0YsRUFBclEsQ0FBVixDQUFOO0FBQTJSO0FBQUMsR0FBMVgsTUFBOFgsRUFBdUM7O0FBQUEsUUFBTXFFLFFBQVEsR0FBQ0gsS0FBSyxJQUFFLE9BQU9BLEtBQVAsS0FBZSxRQUF0QixJQUFnQ0EsS0FBSyxDQUFDdkUsR0FBckQ7QUFBeUQsUUFBSyxDQUFDMkUsa0JBQUQsRUFBb0J6RyxTQUFwQixJQUErQixDQUFDLEdBQUVwSCxnQkFBZ0IsQ0FBQ2lILGVBQXBCLEVBQXFDO0FBQUNDLGNBQVUsRUFBQztBQUFaLEdBQXJDLENBQXBDOztBQUErRixRQUFNSCxNQUFNLEdBQUNuSCxNQUFNLENBQUNrQixPQUFQLENBQWVnTixXQUFmLENBQTJCQyxFQUFFLElBQUU7QUFBQ0Ysc0JBQWtCLENBQUNFLEVBQUQsQ0FBbEI7O0FBQXVCLFFBQUdILFFBQUgsRUFBWTtBQUFDLFVBQUcsT0FBT0EsUUFBUCxLQUFrQixVQUFyQixFQUFnQ0EsUUFBUSxDQUFDRyxFQUFELENBQVIsQ0FBaEMsS0FBa0QsSUFBRyxPQUFPSCxRQUFQLEtBQWtCLFFBQXJCLEVBQThCO0FBQUNBLGdCQUFRLENBQUNWLE9BQVQsR0FBaUJhLEVBQWpCO0FBQXFCO0FBQUM7QUFBQyxHQUE1SyxFQUE2SyxDQUFDSCxRQUFELEVBQVVDLGtCQUFWLENBQTdLLENBQWI7O0FBQXlOLEdBQUMsR0FBRWpPLE1BQU0sQ0FBQ29PLFNBQVYsRUFBcUIsTUFBSTtBQUFDLFVBQU1DLGNBQWMsR0FBQzdHLFNBQVMsSUFBRTdELENBQVgsSUFBYyxDQUFDLEdBQUUrRyxPQUFPLENBQUNNLFVBQVgsRUFBdUJyQixJQUF2QixDQUFuQztBQUFnRSxVQUFNc0IsU0FBUyxHQUFDLE9BQU9DLE1BQVAsS0FBZ0IsV0FBaEIsR0FBNEJBLE1BQTVCLEdBQW1DSixNQUFNLElBQUVBLE1BQU0sQ0FBQ0ksTUFBbEU7QUFBeUUsVUFBTW9ELFlBQVksR0FBQzFELFVBQVUsQ0FBQ2pCLElBQUksR0FBQyxHQUFMLEdBQVNELEVBQVQsSUFBYXVCLFNBQVMsR0FBQyxNQUFJQSxTQUFMLEdBQWUsRUFBckMsQ0FBRCxDQUE3Qjs7QUFBd0UsUUFBR29ELGNBQWMsSUFBRSxDQUFDQyxZQUFwQixFQUFpQztBQUFDekQsY0FBUSxDQUFDQyxNQUFELEVBQVFuQixJQUFSLEVBQWFELEVBQWIsRUFBZ0I7QUFBQ3dCLGNBQU0sRUFBQ0Q7QUFBUixPQUFoQixDQUFSO0FBQTZDO0FBQUMsR0FBM1QsRUFBNFQsQ0FBQ3ZCLEVBQUQsRUFBSUMsSUFBSixFQUFTbkMsU0FBVCxFQUFtQjBELE1BQW5CLEVBQTBCdkgsQ0FBMUIsRUFBNEJtSCxNQUE1QixDQUE1VDtBQUFpVyxRQUFNeUQsVUFBVSxHQUFDO0FBQUNqRixPQUFHLEVBQUNuQyxNQUFMO0FBQVlxSCxXQUFPLEVBQUMxQyxDQUFDLElBQUU7QUFBQyxVQUFHK0IsS0FBSyxDQUFDdkIsS0FBTixJQUFhLE9BQU91QixLQUFLLENBQUN2QixLQUFOLENBQVlrQyxPQUFuQixLQUE2QixVQUE3QyxFQUF3RDtBQUFDWCxhQUFLLENBQUN2QixLQUFOLENBQVlrQyxPQUFaLENBQW9CMUMsQ0FBcEI7QUFBd0I7O0FBQUEsVUFBRyxDQUFDQSxDQUFDLENBQUMyQyxnQkFBTixFQUF1QjtBQUFDNUMsbUJBQVcsQ0FBQ0MsQ0FBRCxFQUFHaEIsTUFBSCxFQUFVbkIsSUFBVixFQUFlRCxFQUFmLEVBQWtCcUMsT0FBbEIsRUFBMEJDLE9BQTFCLEVBQWtDQyxNQUFsQyxFQUF5Q2YsTUFBekMsQ0FBWDtBQUE2RDtBQUFDO0FBQS9MLEdBQWpCOztBQUFrTnFELFlBQVUsQ0FBQ0csWUFBWCxHQUF3QjVDLENBQUMsSUFBRTtBQUFDLFFBQUcsQ0FBQyxDQUFDLEdBQUVwQixPQUFPLENBQUNNLFVBQVgsRUFBdUJyQixJQUF2QixDQUFKLEVBQWlDOztBQUFPLFFBQUdrRSxLQUFLLENBQUN2QixLQUFOLElBQWEsT0FBT3VCLEtBQUssQ0FBQ3ZCLEtBQU4sQ0FBWW9DLFlBQW5CLEtBQWtDLFVBQWxELEVBQTZEO0FBQUNiLFdBQUssQ0FBQ3ZCLEtBQU4sQ0FBWW9DLFlBQVosQ0FBeUI1QyxDQUF6QjtBQUE2Qjs7QUFBQWpCLFlBQVEsQ0FBQ0MsTUFBRCxFQUFRbkIsSUFBUixFQUFhRCxFQUFiLEVBQWdCO0FBQUM5RCxjQUFRLEVBQUM7QUFBVixLQUFoQixDQUFSO0FBQTBDLEdBQXpNLENBVjV2QyxDQVVzOEM7QUFDN2hEOzs7QUFDQSxNQUFHMEcsS0FBSyxDQUFDVyxRQUFOLElBQWdCWSxLQUFLLENBQUNjLElBQU4sS0FBYSxHQUFiLElBQWtCLEVBQUUsVUFBU2QsS0FBSyxDQUFDdkIsS0FBakIsQ0FBckMsRUFBNkQ7QUFBQyxVQUFNckIsU0FBUyxHQUFDLE9BQU9DLE1BQVAsS0FBZ0IsV0FBaEIsR0FBNEJBLE1BQTVCLEdBQW1DSixNQUFNLElBQUVBLE1BQU0sQ0FBQ0ksTUFBbEUsQ0FBRCxDQUEwRTtBQUN2STs7QUFDQSxVQUFNMEQsWUFBWSxHQUFDOUQsTUFBTSxJQUFFQSxNQUFNLENBQUMrRCxjQUFmLElBQStCLENBQUMsR0FBRW5FLE9BQU8sQ0FBQ29FLGVBQVgsRUFBNEJwRixFQUE1QixFQUErQnVCLFNBQS9CLEVBQXlDSCxNQUFNLElBQUVBLE1BQU0sQ0FBQ2lFLE9BQXhELEVBQWdFakUsTUFBTSxJQUFFQSxNQUFNLENBQUNrRSxhQUEvRSxDQUFsRDtBQUFnSlQsY0FBVSxDQUFDNUUsSUFBWCxHQUFnQmlGLFlBQVksSUFBRSxDQUFDLEdBQUVsRSxPQUFPLENBQUN1RSxXQUFYLEVBQXdCLENBQUMsR0FBRXZFLE9BQU8sQ0FBQ3dFLFNBQVgsRUFBc0J4RixFQUF0QixFQUF5QnVCLFNBQXpCLEVBQW1DSCxNQUFNLElBQUVBLE1BQU0sQ0FBQ3FFLGFBQWxELENBQXhCLENBQTlCO0FBQXlIOztBQUFBLFNBQU0sYUFBYW5QLE1BQU0sQ0FBQ2tCLE9BQVAsQ0FBZWtPLFlBQWYsQ0FBNEJ2QixLQUE1QixFQUFrQ1UsVUFBbEMsQ0FBbkI7QUFBa0U7O0FBQUEsSUFBSWMsUUFBUSxHQUFDaEQsSUFBYjtBQUFrQnpNLGVBQUEsR0FBZ0J5UCxRQUFoQixDOzs7Ozs7Ozs7OztBQ3hCaFY7O0FBQUF6UCxrQkFBQSxHQUFtQixJQUFuQjtBQUF3QkEsK0JBQUEsR0FBZ0MwUCx1QkFBaEM7QUFBd0QxUCxrQ0FBQSxHQUFtQyxLQUFLLENBQXhDO0FBQTBDO0FBQ3ZJO0FBQ0E7O0FBQUcsU0FBUzBQLHVCQUFULENBQWlDM04sSUFBakMsRUFBc0M7QUFBQyxTQUFPQSxJQUFJLENBQUM0TixRQUFMLENBQWMsR0FBZCxLQUFvQjVOLElBQUksS0FBRyxHQUEzQixHQUErQkEsSUFBSSxDQUFDb0ksS0FBTCxDQUFXLENBQVgsRUFBYSxDQUFDLENBQWQsQ0FBL0IsR0FBZ0RwSSxJQUF2RDtBQUE2RDtBQUFBO0FBQ3ZHO0FBQ0E7QUFDQTs7O0FBQUcsTUFBTTZOLDBCQUEwQixHQUFDek4sTUFBQSxHQUFrQ0osQ0FBbEMsR0FBNksyTix1QkFBOU07QUFBc08xUCxrQ0FBQSxHQUFtQzRQLDBCQUFuQyxDOzs7Ozs7Ozs7OztBQ0w1Tjs7QUFBQTVQLGtCQUFBLEdBQW1CLElBQW5CO0FBQXdCQSwwQkFBQSxHQUEyQkEsMkJBQUEsR0FBNEIsS0FBSyxDQUE1RDs7QUFBOEQsTUFBTTZQLG1CQUFtQixHQUFDLE9BQU9DLElBQVAsS0FBYyxXQUFkLElBQTJCQSxJQUFJLENBQUNELG1CQUFoQyxJQUFxRCxVQUFTRSxFQUFULEVBQVk7QUFBQyxNQUFJQyxLQUFLLEdBQUNDLElBQUksQ0FBQ0MsR0FBTCxFQUFWO0FBQXFCLFNBQU9DLFVBQVUsQ0FBQyxZQUFVO0FBQUNKLE1BQUUsQ0FBQztBQUFDSyxnQkFBVSxFQUFDLEtBQVo7QUFBa0JDLG1CQUFhLEVBQUMsWUFBVTtBQUFDLGVBQU9oTixJQUFJLENBQUNpTixHQUFMLENBQVMsQ0FBVCxFQUFXLE1BQUlMLElBQUksQ0FBQ0MsR0FBTCxLQUFXRixLQUFmLENBQVgsQ0FBUDtBQUEwQztBQUFyRixLQUFELENBQUY7QUFBNEYsR0FBeEcsRUFBeUcsQ0FBekcsQ0FBakI7QUFBOEgsQ0FBL087O0FBQWdQaFEsMkJBQUEsR0FBNEI2UCxtQkFBNUI7O0FBQWdELE1BQU1VLGtCQUFrQixHQUFDLE9BQU9ULElBQVAsS0FBYyxXQUFkLElBQTJCQSxJQUFJLENBQUNTLGtCQUFoQyxJQUFvRCxVQUFTQyxFQUFULEVBQVk7QUFBQyxTQUFPQyxZQUFZLENBQUNELEVBQUQsQ0FBbkI7QUFBeUIsQ0FBbkg7O0FBQW9IeFEsMEJBQUEsR0FBMkJ1USxrQkFBM0IsQzs7Ozs7Ozs7Ozs7QUNBMWU7O0FBQUEsSUFBSXpRLHNCQUFzQixHQUFDQyxtQkFBTyxDQUFDLHNJQUFELENBQWxDOztBQUFtRkMsa0JBQUEsR0FBbUIsSUFBbkI7QUFBd0JBLHNCQUFBLEdBQXVCMFEsY0FBdkI7QUFBc0MxUSxvQkFBQSxHQUFxQjJRLFlBQXJCO0FBQWtDM1EsOEJBQUEsR0FBK0I0USxzQkFBL0I7QUFBc0Q1USxlQUFBLEdBQWdCLEtBQUssQ0FBckI7O0FBQXVCLElBQUk2USxzQkFBc0IsR0FBQy9RLHNCQUFzQixDQUFDQyxtQkFBTyxDQUFDLDRIQUFELENBQVIsQ0FBakQ7O0FBQXdILElBQUkrUSxvQkFBb0IsR0FBQy9RLG1CQUFPLENBQUMseUZBQUQsQ0FBaEMsQyxDQUE0RDtBQUNqYztBQUNBO0FBQ0E7OztBQUNBLE1BQU1nUixpQkFBaUIsR0FBQyxJQUF4Qjs7QUFBNkIsU0FBU0MsVUFBVCxDQUFvQnBILEdBQXBCLEVBQXdCaEcsR0FBeEIsRUFBNEJxTixTQUE1QixFQUFzQztBQUFDLE1BQUlDLEtBQUssR0FBQ3ROLEdBQUcsQ0FBQ2dCLEdBQUosQ0FBUWdGLEdBQVIsQ0FBVjs7QUFBdUIsTUFBR3NILEtBQUgsRUFBUztBQUFDLFFBQUcsWUFBV0EsS0FBZCxFQUFvQjtBQUFDLGFBQU9BLEtBQUssQ0FBQ0MsTUFBYjtBQUFxQjs7QUFBQSxXQUFPN0wsT0FBTyxDQUFDQyxPQUFSLENBQWdCMkwsS0FBaEIsQ0FBUDtBQUErQjs7QUFBQSxNQUFJRSxRQUFKO0FBQWEsUUFBTUMsSUFBSSxHQUFDLElBQUkvTCxPQUFKLENBQVlDLE9BQU8sSUFBRTtBQUFDNkwsWUFBUSxHQUFDN0wsT0FBVDtBQUFrQixHQUF4QyxDQUFYO0FBQXFEM0IsS0FBRyxDQUFDME4sR0FBSixDQUFRMUgsR0FBUixFQUFZc0gsS0FBSyxHQUFDO0FBQUMzTCxXQUFPLEVBQUM2TCxRQUFUO0FBQWtCRCxVQUFNLEVBQUNFO0FBQXpCLEdBQWxCO0FBQWtELFNBQU9KLFNBQVMsR0FBQztBQUNuVEEsV0FBUyxHQUFHeEwsSUFBWixDQUFpQjhMLEtBQUssS0FBR0gsUUFBUSxDQUFDRyxLQUFELENBQVIsRUFBZ0JBLEtBQW5CLENBQXRCLENBRGtULEdBQ2pRRixJQURpUDtBQUMzTzs7QUFBQSxTQUFTRyxXQUFULENBQXFCQyxJQUFyQixFQUEwQjtBQUFDLE1BQUc7QUFBQ0EsUUFBSSxHQUFDQyxRQUFRLENBQUN2SSxhQUFULENBQXVCLE1BQXZCLENBQUw7QUFBb0MsV0FBTztBQUNqSTtBQUNBLE9BQUMsQ0FBQ3dJLE1BQU0sQ0FBQ0Msb0JBQVQsSUFBK0IsQ0FBQyxDQUFDRixRQUFRLENBQUNHLFlBQTFDLElBQXdESixJQUFJLENBQUNLLE9BQUwsQ0FBYUMsUUFBYixDQUFzQixVQUF0QjtBQUZrRTtBQUU5QixHQUZWLENBRVUsT0FBTUMsT0FBTixFQUFjO0FBQUMsV0FBTyxLQUFQO0FBQWM7QUFBQzs7QUFBQSxNQUFNQyxXQUFXLEdBQUNULFdBQVcsRUFBN0I7O0FBQWdDLFNBQVNVLGNBQVQsQ0FBd0JuSSxJQUF4QixFQUE2QkQsRUFBN0IsRUFBZ0MySCxJQUFoQyxFQUFxQztBQUFDLFNBQU8sSUFBSW5NLE9BQUosQ0FBWSxDQUFDNk0sR0FBRCxFQUFLQyxHQUFMLEtBQVc7QUFBQyxRQUFHVixRQUFRLENBQUNXLGFBQVQsQ0FBd0IsK0JBQThCdEksSUFBSyxJQUEzRCxDQUFILEVBQW1FO0FBQUMsYUFBT29JLEdBQUcsRUFBVjtBQUFjOztBQUFBVixRQUFJLEdBQUNDLFFBQVEsQ0FBQ3ZJLGFBQVQsQ0FBdUIsTUFBdkIsQ0FBTCxDQUFuRixDQUF1SDs7QUFDclYsUUFBR1csRUFBSCxFQUFNMkgsSUFBSSxDQUFDM0gsRUFBTCxHQUFRQSxFQUFSO0FBQVcySCxRQUFJLENBQUM1SCxHQUFMLEdBQVUsVUFBVjtBQUFvQjRILFFBQUksQ0FBQ2EsV0FBTCxHQUFpQm5RLFNBQWpCO0FBQWlEc1AsUUFBSSxDQUFDM0wsTUFBTCxHQUFZcU0sR0FBWjtBQUFnQlYsUUFBSSxDQUFDYyxPQUFMLEdBQWFILEdBQWIsQ0FEd0gsQ0FDdkc7O0FBQ3ZIWCxRQUFJLENBQUMxSCxJQUFMLEdBQVVBLElBQVY7QUFBZTJILFlBQVEsQ0FBQ2MsSUFBVCxDQUFjQyxXQUFkLENBQTBCaEIsSUFBMUI7QUFBaUMsR0FGdUosQ0FBUDtBQUU3STs7QUFBQSxNQUFNaUIsZ0JBQWdCLEdBQUNDLE1BQU0sQ0FBQyxrQkFBRCxDQUE3QixDLENBQWtEOztBQUNyRyxTQUFTakMsY0FBVCxDQUF3QmpHLEdBQXhCLEVBQTRCO0FBQUMsU0FBT2xCLE1BQU0sQ0FBQ3FKLGNBQVAsQ0FBc0JuSSxHQUF0QixFQUEwQmlJLGdCQUExQixFQUEyQyxFQUEzQyxDQUFQO0FBQXVEOztBQUFBLFNBQVMvQixZQUFULENBQXNCbEcsR0FBdEIsRUFBMEI7QUFBQyxTQUFPQSxHQUFHLElBQUVpSSxnQkFBZ0IsSUFBSWpJLEdBQWhDO0FBQXFDOztBQUFBLFNBQVNvSSxZQUFULENBQXNCeFIsR0FBdEIsRUFBMEJ5UixNQUExQixFQUFpQztBQUFDLFNBQU8sSUFBSXhOLE9BQUosQ0FBWSxDQUFDQyxPQUFELEVBQVN3TixNQUFULEtBQWtCO0FBQUNELFVBQU0sR0FBQ3BCLFFBQVEsQ0FBQ3ZJLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBUCxDQUFELENBQXlDO0FBQ3BRO0FBQ0E7O0FBQ0EySixVQUFNLENBQUNoTixNQUFQLEdBQWNQLE9BQWQ7O0FBQXNCdU4sVUFBTSxDQUFDUCxPQUFQLEdBQWUsTUFBSVEsTUFBTSxDQUFDckMsY0FBYyxDQUFDLElBQUk1TCxLQUFKLENBQVcsMEJBQXlCekQsR0FBSSxFQUF4QyxDQUFELENBQWYsQ0FBekIsQ0FIcU0sQ0FHL0c7QUFDNUc7OztBQUNBeVIsVUFBTSxDQUFDUixXQUFQLEdBQW1CblEsU0FBbkIsQ0FMMk4sQ0FLeEs7QUFDbkQ7O0FBQ0EyUSxVQUFNLENBQUN6UixHQUFQLEdBQVdBLEdBQVg7QUFBZXFRLFlBQVEsQ0FBQ3NCLElBQVQsQ0FBY1AsV0FBZCxDQUEwQkssTUFBMUI7QUFBbUMsR0FQMkksQ0FBUDtBQU9qSSxDLENBQUE7OztBQUNyRCxTQUFTRyx5QkFBVCxDQUFtQ2xQLENBQW5DLEVBQXFDbVAsRUFBckMsRUFBd0N6SSxHQUF4QyxFQUE0QztBQUFDLFNBQU8sSUFBSW5GLE9BQUosQ0FBWSxDQUFDQyxPQUFELEVBQVN3TixNQUFULEtBQWtCO0FBQUMsUUFBSUksU0FBUyxHQUFDLEtBQWQ7QUFBb0JwUCxLQUFDLENBQUMwQixJQUFGLENBQU8yTixDQUFDLElBQUU7QUFBQztBQUNsSEQsZUFBUyxHQUFDLElBQVY7QUFBZTVOLGFBQU8sQ0FBQzZOLENBQUQsQ0FBUDtBQUFZLEtBRDRFLEVBQzFFNU4sS0FEMEUsQ0FDcEV1TixNQURvRTtBQUM1RCxLQUFDLEdBQUVqQyxvQkFBb0IsQ0FBQ2pCLG1CQUF4QixFQUE2QyxNQUFJTSxVQUFVLENBQUMsTUFBSTtBQUFDLFVBQUcsQ0FBQ2dELFNBQUosRUFBYztBQUFDSixjQUFNLENBQUN0SSxHQUFELENBQU47QUFBYTtBQUFDLEtBQW5DLEVBQW9DeUksRUFBcEMsQ0FBM0Q7QUFBcUcsR0FENUYsQ0FBUDtBQUNzRyxDLENBQUE7QUFDbko7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsU0FBU3RDLHNCQUFULEdBQWlDO0FBQUMsTUFBR2QsSUFBSSxDQUFDdUQsZ0JBQVIsRUFBeUI7QUFBQyxXQUFPL04sT0FBTyxDQUFDQyxPQUFSLENBQWdCdUssSUFBSSxDQUFDdUQsZ0JBQXJCLENBQVA7QUFBK0M7O0FBQUEsUUFBTUMsZUFBZSxHQUFDLElBQUloTyxPQUFKLENBQVlDLE9BQU8sSUFBRTtBQUFDO0FBQ3ZKLFVBQU13SyxFQUFFLEdBQUNELElBQUksQ0FBQ3lELG1CQUFkOztBQUFrQ3pELFFBQUksQ0FBQ3lELG1CQUFMLEdBQXlCLE1BQUk7QUFBQ2hPLGFBQU8sQ0FBQ3VLLElBQUksQ0FBQ3VELGdCQUFOLENBQVA7QUFBK0J0RCxRQUFFLElBQUVBLEVBQUUsRUFBTjtBQUFVLEtBQXZFO0FBQXlFLEdBRHNCLENBQXRCO0FBQ0UsU0FBT2tELHlCQUF5QixDQUFDSyxlQUFELEVBQWlCdkMsaUJBQWpCLEVBQW1DTCxjQUFjLENBQUMsSUFBSTVMLEtBQUosQ0FBVSxzQ0FBVixDQUFELENBQWpELENBQWhDO0FBQXVJOztBQUFBLFNBQVMwTyxnQkFBVCxDQUEwQkMsV0FBMUIsRUFBc0NDLEtBQXRDLEVBQTRDO0FBQUMsWUFBd0M7QUFBQyxXQUFPcE8sT0FBTyxDQUFDQyxPQUFSLENBQWdCO0FBQUNvTyxhQUFPLEVBQUMsQ0FBQ0YsV0FBVyxHQUFDLDRCQUFaLEdBQXlDRyxTQUFTLENBQUMsQ0FBQyxHQUFFL0Msc0JBQXNCLENBQUN2UCxPQUExQixFQUFtQ29TLEtBQW5DLEVBQXlDLEtBQXpDLENBQUQsQ0FBbkQsQ0FBVDtBQUErRztBQUNoZEcsU0FBRyxFQUFDO0FBRDZWLEtBQWhCLENBQVA7QUFDaFU7O0FBQUEsU0FBT2pELHNCQUFzQixHQUFHbkwsSUFBekIsQ0FBOEJxTyxRQUFRLElBQUU7QUFBQyxRQUFHLEVBQUVKLEtBQUssSUFBSUksUUFBWCxDQUFILEVBQXdCO0FBQUMsWUFBTXBELGNBQWMsQ0FBQyxJQUFJNUwsS0FBSixDQUFXLDJCQUEwQjRPLEtBQU0sRUFBM0MsQ0FBRCxDQUFwQjtBQUFxRTs7QUFBQSxVQUFNSyxRQUFRLEdBQUNELFFBQVEsQ0FBQ0osS0FBRCxDQUFSLENBQWdCOVAsR0FBaEIsQ0FBb0JzTixLQUFLLElBQUV1QyxXQUFXLEdBQUMsU0FBWixHQUFzQkcsU0FBUyxDQUFDMUMsS0FBRCxDQUExRCxDQUFmO0FBQWtGLFdBQU07QUFBQ3lDLGFBQU8sRUFBQ0ksUUFBUSxDQUFDdlEsTUFBVCxDQUFnQndRLENBQUMsSUFBRUEsQ0FBQyxDQUFDckUsUUFBRixDQUFXLEtBQVgsQ0FBbkIsQ0FBVDtBQUErQ2tFLFNBQUcsRUFBQ0UsUUFBUSxDQUFDdlEsTUFBVCxDQUFnQndRLENBQUMsSUFBRUEsQ0FBQyxDQUFDckUsUUFBRixDQUFXLE1BQVgsQ0FBbkI7QUFBbkQsS0FBTjtBQUFrRyxHQUEzVCxDQUFQO0FBQXFVOztBQUFBLFNBQVNzRSxpQkFBVCxDQUEyQlIsV0FBM0IsRUFBdUM7QUFBQyxRQUFNUyxXQUFXLEdBQUMsSUFBSXBULEdBQUosRUFBbEI7QUFBNEIsUUFBTXFULGFBQWEsR0FBQyxJQUFJclQsR0FBSixFQUFwQjtBQUE4QixRQUFNc1QsV0FBVyxHQUFDLElBQUl0VCxHQUFKLEVBQWxCO0FBQTRCLFFBQU11VCxNQUFNLEdBQUMsSUFBSXZULEdBQUosRUFBYjs7QUFBdUIsV0FBU3dULGtCQUFULENBQTRCalQsR0FBNUIsRUFBZ0M7QUFBQyxRQUFJZ1EsSUFBSSxHQUFDOEMsYUFBYSxDQUFDdlAsR0FBZCxDQUFrQnZELEdBQWxCLENBQVQ7O0FBQWdDLFFBQUdnUSxJQUFILEVBQVE7QUFBQyxhQUFPQSxJQUFQO0FBQWEsS0FBdkQsQ0FBdUQ7OztBQUMzakIsUUFBR0ssUUFBUSxDQUFDVyxhQUFULENBQXdCLGdCQUFlaFIsR0FBSSxJQUEzQyxDQUFILEVBQW1EO0FBQUMsYUFBT2lFLE9BQU8sQ0FBQ0MsT0FBUixFQUFQO0FBQTBCOztBQUFBNE8saUJBQWEsQ0FBQzdDLEdBQWQsQ0FBa0JqUSxHQUFsQixFQUFzQmdRLElBQUksR0FBQ3dCLFlBQVksQ0FBQ3hSLEdBQUQsQ0FBdkM7QUFBOEMsV0FBT2dRLElBQVA7QUFBYTs7QUFBQSxXQUFTa0QsZUFBVCxDQUF5QnhLLElBQXpCLEVBQThCO0FBQUMsUUFBSXNILElBQUksR0FBQytDLFdBQVcsQ0FBQ3hQLEdBQVosQ0FBZ0JtRixJQUFoQixDQUFUOztBQUErQixRQUFHc0gsSUFBSCxFQUFRO0FBQUMsYUFBT0EsSUFBUDtBQUFhOztBQUFBK0MsZUFBVyxDQUFDOUMsR0FBWixDQUFnQnZILElBQWhCLEVBQXFCc0gsSUFBSSxHQUFDbUQsS0FBSyxDQUFDekssSUFBRCxDQUFMLENBQVl0RSxJQUFaLENBQWlCME0sR0FBRyxJQUFFO0FBQUMsVUFBRyxDQUFDQSxHQUFHLENBQUNzQyxFQUFSLEVBQVc7QUFBQyxjQUFNLElBQUkzUCxLQUFKLENBQVcsOEJBQTZCaUYsSUFBSyxFQUE3QyxDQUFOO0FBQXVEOztBQUFBLGFBQU9vSSxHQUFHLENBQUN1QyxJQUFKLEdBQVdqUCxJQUFYLENBQWdCaVAsSUFBSSxLQUFHO0FBQUMzSyxZQUFJLEVBQUNBLElBQU47QUFBVzRLLGVBQU8sRUFBQ0Q7QUFBbkIsT0FBSCxDQUFwQixDQUFQO0FBQTBELEtBQXBKLEVBQXNKbFAsS0FBdEosQ0FBNEppRixHQUFHLElBQUU7QUFBQyxZQUFNaUcsY0FBYyxDQUFDakcsR0FBRCxDQUFwQjtBQUEyQixLQUE3TCxDQUExQjtBQUEwTixXQUFPNEcsSUFBUDtBQUFhOztBQUFBLFNBQU07QUFBQ3VELGtCQUFjLENBQUNsQixLQUFELEVBQU87QUFBQyxhQUFPMUMsVUFBVSxDQUFDMEMsS0FBRCxFQUFPUSxXQUFQLENBQWpCO0FBQXNDLEtBQTdEOztBQUE4RFcsZ0JBQVksQ0FBQ25CLEtBQUQsRUFBT29CLE9BQVAsRUFBZTtBQUFDeFAsYUFBTyxDQUFDQyxPQUFSLENBQWdCdVAsT0FBaEIsRUFBeUJyUCxJQUF6QixDQUE4QnNQLEVBQUUsSUFBRUEsRUFBRSxFQUFwQyxFQUF3Q3RQLElBQXhDLENBQTZDekYsT0FBTyxLQUFHO0FBQUNnVixpQkFBUyxFQUFDaFYsT0FBTyxJQUFFQSxPQUFPLENBQUNzQixPQUFqQixJQUEwQnRCLE9BQXJDO0FBQTZDQSxlQUFPLEVBQUNBO0FBQXJELE9BQUgsQ0FBcEQsRUFBc0h5SyxHQUFHLEtBQUc7QUFBQ0MsYUFBSyxFQUFDRDtBQUFQLE9BQUgsQ0FBekgsRUFBMEloRixJQUExSSxDQUErSXdQLEtBQUssSUFBRTtBQUFDLGNBQU1DLEdBQUcsR0FBQ2hCLFdBQVcsQ0FBQ3RQLEdBQVosQ0FBZ0I4TyxLQUFoQixDQUFWO0FBQWlDUSxtQkFBVyxDQUFDNUMsR0FBWixDQUFnQm9DLEtBQWhCLEVBQXNCdUIsS0FBdEI7QUFBNkIsWUFBR0MsR0FBRyxJQUFFLGFBQVlBLEdBQXBCLEVBQXdCQSxHQUFHLENBQUMzUCxPQUFKLENBQVkwUCxLQUFaO0FBQW9CLE9BQWpRO0FBQW9RLEtBQTlWOztBQUErVkUsYUFBUyxDQUFDekIsS0FBRCxFQUFPekksUUFBUCxFQUFnQjtBQUFDLGFBQU8rRixVQUFVLENBQUMwQyxLQUFELEVBQU9XLE1BQVAsRUFBYyxNQUFJO0FBQUMsZUFBT3BCLHlCQUF5QixDQUFDTyxnQkFBZ0IsQ0FBQ0MsV0FBRCxFQUFhQyxLQUFiLENBQWhCLENBQW9Dak8sSUFBcEMsQ0FBeUMsQ0FBQztBQUFDa08saUJBQUQ7QUFBU0U7QUFBVCxTQUFELEtBQWlCO0FBQUMsaUJBQU92TyxPQUFPLENBQUNpQixHQUFSLENBQVksQ0FBQzJOLFdBQVcsQ0FBQ2tCLEdBQVosQ0FBZ0IxQixLQUFoQixJQUF1QixFQUF2QixHQUEwQnBPLE9BQU8sQ0FBQ2lCLEdBQVIsQ0FBWW9OLE9BQU8sQ0FBQy9QLEdBQVIsQ0FBWTBRLGtCQUFaLENBQVosQ0FBM0IsRUFBd0VoUCxPQUFPLENBQUNpQixHQUFSLENBQVlzTixHQUFHLENBQUNqUSxHQUFKLENBQVEyUSxlQUFSLENBQVosQ0FBeEUsQ0FBWixDQUFQO0FBQW9JLFNBQS9MLEVBQWlNOU8sSUFBak0sQ0FBc00wTSxHQUFHLElBQUU7QUFBQyxpQkFBTyxLQUFLeUMsY0FBTCxDQUFvQmxCLEtBQXBCLEVBQTJCak8sSUFBM0IsQ0FBZ0M0UCxVQUFVLEtBQUc7QUFBQ0Esc0JBQUQ7QUFBWUMsa0JBQU0sRUFBQ25ELEdBQUcsQ0FBQyxDQUFEO0FBQXRCLFdBQUgsQ0FBMUMsQ0FBUDtBQUFrRixTQUE5UixDQUFELEVBQWlTcEIsaUJBQWpTLEVBQW1UTCxjQUFjLENBQUMsSUFBSTVMLEtBQUosQ0FBVyxtQ0FBa0M0TyxLQUFNLEVBQW5ELENBQUQsQ0FBalUsQ0FBekIsQ0FBbVpqTyxJQUFuWixDQUF3WixDQUFDO0FBQUM0UCxvQkFBRDtBQUFZQztBQUFaLFNBQUQsS0FBdUI7QUFBQyxnQkFBTW5ELEdBQUcsR0FBQzVJLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUM4TCxrQkFBTSxFQUFDQTtBQUFSLFdBQWQsRUFBOEJELFVBQTlCLENBQVY7QUFBb0QsaUJBQU0sV0FBVUEsVUFBVixHQUFxQkEsVUFBckIsR0FBZ0NsRCxHQUF0QztBQUEyQyxTQUEvZ0IsRUFBaWhCM00sS0FBamhCLENBQXVoQmlGLEdBQUcsSUFBRTtBQUFDLGNBQUdRLFFBQUgsRUFBWTtBQUFDO0FBQ3g1QyxrQkFBTVIsR0FBTjtBQUFXOztBQUFBLGlCQUFNO0FBQUNDLGlCQUFLLEVBQUNEO0FBQVAsV0FBTjtBQUFtQixTQURnMUIsQ0FBUDtBQUN0MEIsT0FEbXpCLENBQWpCO0FBQy94QixLQURzYTs7QUFDcmFRLFlBQVEsQ0FBQ3lJLEtBQUQsRUFBTztBQUFDO0FBQ3JEO0FBQ0EsVUFBSTZCLEVBQUo7O0FBQU8sVUFBR0EsRUFBRSxHQUFDQyxTQUFTLENBQUNDLFVBQWhCLEVBQTJCO0FBQUM7QUFDbkMsWUFBR0YsRUFBRSxDQUFDRyxRQUFILElBQWEsS0FBS0MsSUFBTCxDQUFVSixFQUFFLENBQUNLLGFBQWIsQ0FBaEIsRUFBNEMsT0FBT3RRLE9BQU8sQ0FBQ0MsT0FBUixFQUFQO0FBQTBCOztBQUFBLGFBQU9pTyxnQkFBZ0IsQ0FBQ0MsV0FBRCxFQUFhQyxLQUFiLENBQWhCLENBQW9Dak8sSUFBcEMsQ0FBeUNvUSxNQUFNLElBQUV2USxPQUFPLENBQUNpQixHQUFSLENBQVkwTCxXQUFXLEdBQUM0RCxNQUFNLENBQUNsQyxPQUFQLENBQWUvUCxHQUFmLENBQW1Ca1AsTUFBTSxJQUFFWixjQUFjLENBQUNZLE1BQUQsRUFBUSxRQUFSLENBQXpDLENBQUQsR0FBNkQsRUFBcEYsQ0FBakQsRUFBMElyTixJQUExSSxDQUErSSxNQUFJO0FBQUMsU0FBQyxHQUFFcUwsb0JBQW9CLENBQUNqQixtQkFBeEIsRUFBNkMsTUFBSSxLQUFLc0YsU0FBTCxDQUFlekIsS0FBZixFQUFxQixJQUFyQixFQUEyQmxPLEtBQTNCLENBQWlDLE1BQUksQ0FBRSxDQUF2QyxDQUFqRDtBQUE0RixPQUFoUCxFQUFrUEEsS0FBbFAsRUFBd1A7QUFDclUsWUFBSSxDQUFFLENBRHVFLENBQVA7QUFDN0Q7O0FBTGljLEdBQU47QUFLeGI7O0FBQUEsSUFBSWlLLFFBQVEsR0FBQ3dFLGlCQUFiO0FBQStCalUsZUFBQSxHQUFnQnlQLFFBQWhCLEM7Ozs7Ozs7Ozs7O0FDakM5Qjs7QUFBQSxJQUFJNUUsdUJBQXVCLEdBQUM5SyxtQkFBTyxDQUFDLHdJQUFELENBQW5DOztBQUFxRixJQUFJRCxzQkFBc0IsR0FBQ0MsbUJBQU8sQ0FBQyxzSUFBRCxDQUFsQzs7QUFBbUZDLGtCQUFBLEdBQW1CLElBQW5CO0FBQXdCQSxpQkFBQSxHQUFrQjJOLFNBQWxCO0FBQTRCM04sZ0NBQUEsR0FBaUM4Vix3QkFBakM7QUFBMEQ5VixvQkFBQSxHQUFxQkEsa0JBQUEsR0FBbUJBLGVBQUEsR0FBZ0IsS0FBSyxDQUE3RDs7QUFBK0QsSUFBSUksTUFBTSxHQUFDTixzQkFBc0IsQ0FBQ0MsbUJBQU8sQ0FBQyxvQkFBRCxDQUFSLENBQWpDOztBQUFvRCxJQUFJZ0wsUUFBUSxHQUFDRix1QkFBdUIsQ0FBQzlLLG1CQUFPLENBQUMsbUdBQUQsQ0FBUixDQUFwQzs7QUFBa0ZDLGNBQUEsR0FBZStLLFFBQVEsQ0FBQ3pKLE9BQXhCO0FBQWdDdEIsa0JBQUEsR0FBbUIrSyxRQUFRLENBQUNnTCxVQUE1Qjs7QUFBdUMsSUFBSUMsY0FBYyxHQUFDalcsbUJBQU8sQ0FBQyw0RUFBRCxDQUExQjs7QUFBZ0UsSUFBSWtXLFdBQVcsR0FBQ25XLHNCQUFzQixDQUFDQyxtQkFBTyxDQUFDLHFFQUFELENBQVIsQ0FBdEM7O0FBQWlFQyxrQkFBQSxHQUFtQmlXLFdBQVcsQ0FBQzNVLE9BQS9CO0FBQXVDOztBQUFtQixNQUFNNFUsZUFBZSxHQUFDO0FBQUNoTCxRQUFNLEVBQUMsSUFBUjtBQUFhO0FBQzd3QmlMLGdCQUFjLEVBQUMsRUFEaXZCOztBQUM5dUJDLE9BQUssQ0FBQ3JHLEVBQUQsRUFBSTtBQUFDLFFBQUcsS0FBSzdFLE1BQVIsRUFBZSxPQUFPNkUsRUFBRSxFQUFUOztBQUFZLGVBQStCLEVBQStCO0FBQUM7O0FBRDBvQixDQUF0QixDLENBQ2xuQjs7QUFDeEgsTUFBTXNHLGlCQUFpQixHQUFDLENBQUMsVUFBRCxFQUFZLE9BQVosRUFBb0IsT0FBcEIsRUFBNEIsUUFBNUIsRUFBcUMsWUFBckMsRUFBa0QsWUFBbEQsRUFBK0QsVUFBL0QsRUFBMEUsUUFBMUUsRUFBbUYsU0FBbkYsRUFBNkYsZUFBN0YsRUFBNkcsU0FBN0csRUFBdUgsV0FBdkgsRUFBbUksZ0JBQW5JLEVBQW9KLGVBQXBKLENBQXhCO0FBQTZMLE1BQU1DLFlBQVksR0FBQyxDQUFDLGtCQUFELEVBQW9CLHFCQUFwQixFQUEwQyxxQkFBMUMsRUFBZ0Usa0JBQWhFLEVBQW1GLGlCQUFuRixFQUFxRyxvQkFBckcsQ0FBbkI7QUFBOEksTUFBTUMsZ0JBQWdCLEdBQUMsQ0FBQyxNQUFELEVBQVEsU0FBUixFQUFrQixRQUFsQixFQUEyQixNQUEzQixFQUFrQyxVQUFsQyxFQUE2QyxnQkFBN0MsQ0FBdkIsQyxDQUFzRjs7QUFDamFoTixNQUFNLENBQUNxSixjQUFQLENBQXNCc0QsZUFBdEIsRUFBc0MsUUFBdEMsRUFBK0M7QUFBQ3RSLEtBQUcsR0FBRTtBQUFDLFdBQU9tRyxRQUFRLENBQUN6SixPQUFULENBQWlCa1YsTUFBeEI7QUFBZ0M7O0FBQXZDLENBQS9DO0FBQXlGSCxpQkFBaUIsQ0FBQ25KLE9BQWxCLENBQTBCdUosS0FBSyxJQUFFO0FBQUM7QUFDM0g7QUFDQTtBQUNBO0FBQ0FsTixRQUFNLENBQUNxSixjQUFQLENBQXNCc0QsZUFBdEIsRUFBc0NPLEtBQXRDLEVBQTRDO0FBQUM3UixPQUFHLEdBQUU7QUFBQyxZQUFNc0csTUFBTSxHQUFDd0wsU0FBUyxFQUF0QjtBQUF5QixhQUFPeEwsTUFBTSxDQUFDdUwsS0FBRCxDQUFiO0FBQXNCOztBQUF0RCxHQUE1QztBQUFzRyxDQUpiO0FBSWVGLGdCQUFnQixDQUFDckosT0FBakIsQ0FBeUJ1SixLQUFLLElBQUU7QUFBQztBQUN6STs7QUFBQ1AsaUJBQWUsQ0FBQ08sS0FBRCxDQUFmLEdBQXVCLENBQUMsR0FBRzdKLElBQUosS0FBVztBQUFDLFVBQU0xQixNQUFNLEdBQUN3TCxTQUFTLEVBQXRCO0FBQXlCLFdBQU94TCxNQUFNLENBQUN1TCxLQUFELENBQU4sQ0FBYyxHQUFHN0osSUFBakIsQ0FBUDtBQUErQixHQUEzRjtBQUE2RixDQURVO0FBQ1IwSixZQUFZLENBQUNwSixPQUFiLENBQXFCMUIsS0FBSyxJQUFFO0FBQUMwSyxpQkFBZSxDQUFDRSxLQUFoQixDQUFzQixNQUFJO0FBQUNyTCxZQUFRLENBQUN6SixPQUFULENBQWlCa1YsTUFBakIsQ0FBd0JHLEVBQXhCLENBQTJCbkwsS0FBM0IsRUFBaUMsQ0FBQyxHQUFHb0IsSUFBSixLQUFXO0FBQUMsWUFBTWdLLFVBQVUsR0FBRSxLQUFJcEwsS0FBSyxDQUFDcUwsTUFBTixDQUFhLENBQWIsRUFBZ0JDLFdBQWhCLEVBQThCLEdBQUV0TCxLQUFLLENBQUN1TCxTQUFOLENBQWdCLENBQWhCLENBQW1CLEVBQXpFO0FBQTJFLFlBQU1DLGdCQUFnQixHQUFDZCxlQUF2Qjs7QUFBdUMsVUFBR2MsZ0JBQWdCLENBQUNKLFVBQUQsQ0FBbkIsRUFBZ0M7QUFBQyxZQUFHO0FBQUNJLDBCQUFnQixDQUFDSixVQUFELENBQWhCLENBQTZCLEdBQUdoSyxJQUFoQztBQUF1QyxTQUEzQyxDQUEyQyxPQUFNbkMsR0FBTixFQUFVO0FBQUN0RCxpQkFBTyxDQUFDdUQsS0FBUixDQUFlLHdDQUF1Q2tNLFVBQVcsRUFBakU7QUFBb0V6UCxpQkFBTyxDQUFDdUQsS0FBUixDQUFlLEdBQUVELEdBQUcsQ0FBQ3dNLE9BQVEsS0FBSXhNLEdBQUcsQ0FBQ3lNLEtBQU0sRUFBM0M7QUFBK0M7QUFBQztBQUFDLEtBQTNXO0FBQThXLEdBQXpZO0FBQTRZLENBQXphOztBQUEyYSxTQUFTUixTQUFULEdBQW9CO0FBQUMsTUFBRyxDQUFDUixlQUFlLENBQUNoTCxNQUFwQixFQUEyQjtBQUFDLFVBQU0rTCxPQUFPLEdBQUMsZ0NBQThCLHFFQUE1QztBQUFrSCxVQUFNLElBQUluUyxLQUFKLENBQVVtUyxPQUFWLENBQU47QUFBMEI7O0FBQUEsU0FBT2YsZUFBZSxDQUFDaEwsTUFBdkI7QUFBK0IsQyxDQUFBOzs7QUFDdnVCLElBQUl1RSxRQUFRLEdBQUN5RyxlQUFiLEMsQ0FBNkI7O0FBQzdCbFcsZUFBQSxHQUFnQnlQLFFBQWhCOztBQUF5QixTQUFTOUIsU0FBVCxHQUFvQjtBQUFDLFNBQU92TixNQUFNLENBQUNrQixPQUFQLENBQWU2VixVQUFmLENBQTBCbkIsY0FBYyxDQUFDb0IsYUFBekMsQ0FBUDtBQUFnRSxDLENBQUE7QUFDOUc7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsTUFBTUMsWUFBWSxHQUFDLENBQUMsR0FBR3pLLElBQUosS0FBVztBQUFDc0osaUJBQWUsQ0FBQ2hMLE1BQWhCLEdBQXVCLElBQUlILFFBQVEsQ0FBQ3pKLE9BQWIsQ0FBcUIsR0FBR3NMLElBQXhCLENBQXZCO0FBQXFEc0osaUJBQWUsQ0FBQ0MsY0FBaEIsQ0FBK0JqSixPQUEvQixDQUF1QzZDLEVBQUUsSUFBRUEsRUFBRSxFQUE3QztBQUFpRG1HLGlCQUFlLENBQUNDLGNBQWhCLEdBQStCLEVBQS9CO0FBQWtDLFNBQU9ELGVBQWUsQ0FBQ2hMLE1BQXZCO0FBQStCLENBQXRNLEMsQ0FBdU07OztBQUN2TWxMLG9CQUFBLEdBQXFCcVgsWUFBckI7O0FBQWtDLFNBQVN2Qix3QkFBVCxDQUFrQzVLLE1BQWxDLEVBQXlDO0FBQUMsUUFBTUosT0FBTyxHQUFDSSxNQUFkO0FBQXFCLFFBQU1vTSxRQUFRLEdBQUMsRUFBZjs7QUFBa0IsT0FBSSxNQUFNQyxRQUFWLElBQXNCbEIsaUJBQXRCLEVBQXdDO0FBQUMsUUFBRyxPQUFPdkwsT0FBTyxDQUFDeU0sUUFBRCxDQUFkLEtBQTJCLFFBQTlCLEVBQXVDO0FBQUNELGNBQVEsQ0FBQ0MsUUFBRCxDQUFSLEdBQW1CaE8sTUFBTSxDQUFDQyxNQUFQLENBQWNnTyxLQUFLLENBQUNDLE9BQU4sQ0FBYzNNLE9BQU8sQ0FBQ3lNLFFBQUQsQ0FBckIsSUFBaUMsRUFBakMsR0FBb0MsRUFBbEQsRUFBcUR6TSxPQUFPLENBQUN5TSxRQUFELENBQTVELENBQW5CLENBQUQsQ0FBNEY7O0FBQy9SO0FBQVU7O0FBQUFELFlBQVEsQ0FBQ0MsUUFBRCxDQUFSLEdBQW1Cek0sT0FBTyxDQUFDeU0sUUFBRCxDQUExQjtBQUFzQyxHQUQyQixDQUMzQjs7O0FBQ2hERCxVQUFRLENBQUNkLE1BQVQsR0FBZ0J6TCxRQUFRLENBQUN6SixPQUFULENBQWlCa1YsTUFBakM7QUFBd0NELGtCQUFnQixDQUFDckosT0FBakIsQ0FBeUJ1SixLQUFLLElBQUU7QUFBQ2EsWUFBUSxDQUFDYixLQUFELENBQVIsR0FBZ0IsQ0FBQyxHQUFHN0osSUFBSixLQUFXO0FBQUMsYUFBTzlCLE9BQU8sQ0FBQzJMLEtBQUQsQ0FBUCxDQUFlLEdBQUc3SixJQUFsQixDQUFQO0FBQWdDLEtBQTVEO0FBQThELEdBQS9GO0FBQWlHLFNBQU8wSyxRQUFQO0FBQWlCLEM7Ozs7Ozs7Ozs7O0FDbkI3STs7QUFBQXRYLGtCQUFBLEdBQW1CLElBQW5CO0FBQXdCQSx1QkFBQSxHQUF3QnlILGVBQXhCOztBQUF3QyxJQUFJckgsTUFBTSxHQUFDTCxtQkFBTyxDQUFDLG9CQUFELENBQWxCOztBQUE0QixJQUFJK1Esb0JBQW9CLEdBQUMvUSxtQkFBTyxDQUFDLHlGQUFELENBQWhDOztBQUE0RCxNQUFNMlgsdUJBQXVCLEdBQUMsT0FBT0Msb0JBQVAsS0FBOEIsV0FBNUQ7O0FBQXdFLFNBQVNsUSxlQUFULENBQXlCO0FBQUNDLFlBQUQ7QUFBWUM7QUFBWixDQUF6QixFQUErQztBQUFDLFFBQU1pUSxVQUFVLEdBQUNqUSxRQUFRLElBQUUsQ0FBQytQLHVCQUE1QjtBQUFvRCxRQUFNRyxTQUFTLEdBQUMsQ0FBQyxHQUFFelgsTUFBTSxDQUFDcU4sTUFBVixHQUFoQjtBQUFvQyxRQUFLLENBQUNxSyxPQUFELEVBQVNDLFVBQVQsSUFBcUIsQ0FBQyxHQUFFM1gsTUFBTSxDQUFDNFgsUUFBVixFQUFvQixLQUFwQixDQUExQjtBQUFxRCxRQUFNelEsTUFBTSxHQUFDLENBQUMsR0FBRW5ILE1BQU0sQ0FBQ2tPLFdBQVYsRUFBdUJDLEVBQUUsSUFBRTtBQUFDLFFBQUdzSixTQUFTLENBQUNuSyxPQUFiLEVBQXFCO0FBQUNtSyxlQUFTLENBQUNuSyxPQUFWO0FBQW9CbUssZUFBUyxDQUFDbkssT0FBVixHQUFrQjlNLFNBQWxCO0FBQTZCOztBQUFBLFFBQUdnWCxVQUFVLElBQUVFLE9BQWYsRUFBdUI7O0FBQU8sUUFBR3ZKLEVBQUUsSUFBRUEsRUFBRSxDQUFDMEosT0FBVixFQUFrQjtBQUFDSixlQUFTLENBQUNuSyxPQUFWLEdBQWtCd0ssT0FBTyxDQUFDM0osRUFBRCxFQUFJM0csU0FBUyxJQUFFQSxTQUFTLElBQUVtUSxVQUFVLENBQUNuUSxTQUFELENBQXBDLEVBQWdEO0FBQUNGO0FBQUQsT0FBaEQsQ0FBekI7QUFBd0Y7QUFBQyxHQUE3TyxFQUE4TyxDQUFDa1EsVUFBRCxFQUFZbFEsVUFBWixFQUF1Qm9RLE9BQXZCLENBQTlPLENBQWI7QUFBNFIsR0FBQyxHQUFFMVgsTUFBTSxDQUFDb08sU0FBVixFQUFxQixNQUFJO0FBQUMsUUFBRyxDQUFDa0osdUJBQUosRUFBNEI7QUFBQyxVQUFHLENBQUNJLE9BQUosRUFBWTtBQUFDLGNBQU1LLFlBQVksR0FBQyxDQUFDLEdBQUVySCxvQkFBb0IsQ0FBQ2pCLG1CQUF4QixFQUE2QyxNQUFJa0ksVUFBVSxDQUFDLElBQUQsQ0FBM0QsQ0FBbkI7QUFBc0YsZUFBTSxNQUFJLENBQUMsR0FBRWpILG9CQUFvQixDQUFDUCxrQkFBeEIsRUFBNEM0SCxZQUE1QyxDQUFWO0FBQXFFO0FBQUM7QUFBQyxHQUFqTyxFQUFrTyxDQUFDTCxPQUFELENBQWxPO0FBQTZPLFNBQU0sQ0FBQ3ZRLE1BQUQsRUFBUXVRLE9BQVIsQ0FBTjtBQUF3Qjs7QUFBQSxTQUFTSSxPQUFULENBQWlCdk8sT0FBakIsRUFBeUJ5TyxRQUF6QixFQUFrQ2pOLE9BQWxDLEVBQTBDO0FBQUMsUUFBSztBQUFDcUYsTUFBRDtBQUFJNkgsWUFBSjtBQUFhQztBQUFiLE1BQXVCQyxjQUFjLENBQUNwTixPQUFELENBQTFDO0FBQW9EbU4sVUFBUSxDQUFDaEgsR0FBVCxDQUFhM0gsT0FBYixFQUFxQnlPLFFBQXJCO0FBQStCQyxVQUFRLENBQUNILE9BQVQsQ0FBaUJ2TyxPQUFqQjtBQUEwQixTQUFPLFNBQVNrTyxTQUFULEdBQW9CO0FBQUNTLFlBQVEsQ0FBQ0UsTUFBVCxDQUFnQjdPLE9BQWhCO0FBQXlCME8sWUFBUSxDQUFDUixTQUFULENBQW1CbE8sT0FBbkIsRUFBMUIsQ0FBc0Q7O0FBQ3ByQyxRQUFHMk8sUUFBUSxDQUFDRyxJQUFULEtBQWdCLENBQW5CLEVBQXFCO0FBQUNKLGNBQVEsQ0FBQ0ssVUFBVDtBQUFzQkMsZUFBUyxDQUFDSCxNQUFWLENBQWlCaEksRUFBakI7QUFBc0I7QUFBQyxHQURnaUM7QUFDOWhDOztBQUFBLE1BQU1tSSxTQUFTLEdBQUMsSUFBSTdYLEdBQUosRUFBaEI7O0FBQTBCLFNBQVN5WCxjQUFULENBQXdCcE4sT0FBeEIsRUFBZ0M7QUFBQyxRQUFNcUYsRUFBRSxHQUFDckYsT0FBTyxDQUFDekQsVUFBUixJQUFvQixFQUE3QjtBQUFnQyxNQUFJNFAsUUFBUSxHQUFDcUIsU0FBUyxDQUFDL1QsR0FBVixDQUFjNEwsRUFBZCxDQUFiOztBQUErQixNQUFHOEcsUUFBSCxFQUFZO0FBQUMsV0FBT0EsUUFBUDtBQUFpQjs7QUFBQSxRQUFNZ0IsUUFBUSxHQUFDLElBQUl4WCxHQUFKLEVBQWY7QUFBeUIsUUFBTXVYLFFBQVEsR0FBQyxJQUFJVixvQkFBSixDQUF5QmlCLE9BQU8sSUFBRTtBQUFDQSxXQUFPLENBQUMxTCxPQUFSLENBQWdCZ0UsS0FBSyxJQUFFO0FBQUMsWUFBTWtILFFBQVEsR0FBQ0UsUUFBUSxDQUFDMVQsR0FBVCxDQUFhc00sS0FBSyxDQUFDekYsTUFBbkIsQ0FBZjtBQUEwQyxZQUFNN0QsU0FBUyxHQUFDc0osS0FBSyxDQUFDMkgsY0FBTixJQUFzQjNILEtBQUssQ0FBQzRILGlCQUFOLEdBQXdCLENBQTlEOztBQUFnRSxVQUFHVixRQUFRLElBQUV4USxTQUFiLEVBQXVCO0FBQUN3USxnQkFBUSxDQUFDeFEsU0FBRCxDQUFSO0FBQXFCO0FBQUMsS0FBaEw7QUFBbUwsR0FBdE4sRUFBdU51RCxPQUF2TixDQUFmO0FBQStPd04sV0FBUyxDQUFDckgsR0FBVixDQUFjZCxFQUFkLEVBQWlCOEcsUUFBUSxHQUFDO0FBQUM5RyxNQUFEO0FBQUk2SCxZQUFKO0FBQWFDO0FBQWIsR0FBMUI7QUFBa0QsU0FBT2hCLFFBQVA7QUFBaUIsQzs7Ozs7Ozs7Ozs7QUNEM2hCOztBQUFBLElBQUl4WCxzQkFBc0IsR0FBQ0MsbUJBQU8sQ0FBQyxzSUFBRCxDQUFsQzs7QUFBbUZDLGtCQUFBLEdBQW1CLElBQW5CO0FBQXdCQSxlQUFBLEdBQWdCK1ksVUFBaEI7O0FBQTJCLElBQUkzWSxNQUFNLEdBQUNOLHNCQUFzQixDQUFDQyxtQkFBTyxDQUFDLG9CQUFELENBQVIsQ0FBakM7O0FBQW9ELElBQUkrSyxPQUFPLEdBQUMvSyxtQkFBTyxDQUFDLDJEQUFELENBQW5COztBQUFnQyxTQUFTZ1osVUFBVCxDQUFvQkMsaUJBQXBCLEVBQXNDO0FBQUMsV0FBU0MsaUJBQVQsQ0FBMkJ2TSxLQUEzQixFQUFpQztBQUFDLFdBQU0sYUFBYXRNLE1BQU0sQ0FBQ2tCLE9BQVAsQ0FBZTZILGFBQWYsQ0FBNkI2UCxpQkFBN0IsRUFBK0N6UCxNQUFNLENBQUNDLE1BQVAsQ0FBYztBQUFDMEIsWUFBTSxFQUFDLENBQUMsR0FBRUosT0FBTyxDQUFDNkMsU0FBWDtBQUFSLEtBQWQsRUFBK0NqQixLQUEvQyxDQUEvQyxDQUFuQjtBQUEwSDs7QUFBQXVNLG1CQUFpQixDQUFDQyxlQUFsQixHQUFrQ0YsaUJBQWlCLENBQUNFLGVBQXBELENBQW1FO0FBQW5FO0FBQ3phRCxtQkFBaUIsQ0FBQ0UsbUJBQWxCLEdBQXNDSCxpQkFBaUIsQ0FBQ0csbUJBQXhEOztBQUE0RSxZQUF1QztBQUFDLFVBQU1DLElBQUksR0FBQ0osaUJBQWlCLENBQUNLLFdBQWxCLElBQStCTCxpQkFBaUIsQ0FBQ0ksSUFBakQsSUFBdUQsU0FBbEU7QUFBNEVILHFCQUFpQixDQUFDSSxXQUFsQixHQUErQixjQUFhRCxJQUFLLEdBQWpEO0FBQXFEOztBQUFBLFNBQU9ILGlCQUFQO0FBQTBCLEM7Ozs7Ozs7Ozs7O0FDRG5ROztBQUFBalosa0JBQUEsR0FBbUIsSUFBbkI7QUFBd0JBLDJCQUFBLEdBQTRCc1osbUJBQTVCOztBQUFnRCxTQUFTQSxtQkFBVCxDQUE2QkMsUUFBN0IsRUFBc0NwSyxPQUF0QyxFQUE4QztBQUFDLE1BQUlxSyxjQUFKLENBQUQsQ0FBb0I7O0FBQ3ZKLFFBQU1DLGFBQWEsR0FBQ0YsUUFBUSxDQUFDRyxLQUFULENBQWUsR0FBZixDQUFwQjtBQUF3QyxHQUFDdkssT0FBTyxJQUFFLEVBQVYsRUFBY3dLLElBQWQsQ0FBbUJyTyxNQUFNLElBQUU7QUFBQyxRQUFHbU8sYUFBYSxDQUFDLENBQUQsQ0FBYixDQUFpQkcsV0FBakIsT0FBaUN0TyxNQUFNLENBQUNzTyxXQUFQLEVBQXBDLEVBQXlEO0FBQUNKLG9CQUFjLEdBQUNsTyxNQUFmO0FBQXNCbU8sbUJBQWEsQ0FBQ0ksTUFBZCxDQUFxQixDQUFyQixFQUF1QixDQUF2QjtBQUEwQk4sY0FBUSxHQUFDRSxhQUFhLENBQUNuVixJQUFkLENBQW1CLEdBQW5CLEtBQXlCLEdBQWxDO0FBQXNDLGFBQU8sSUFBUDtBQUFhOztBQUFBLFdBQU8sS0FBUDtBQUFjLEdBQXZNO0FBQXlNLFNBQU07QUFBQ2lWLFlBQUQ7QUFBVUM7QUFBVixHQUFOO0FBQWlDLEM7Ozs7Ozs7Ozs7O0FDRHJROztBQUFBeFosa0JBQUEsR0FBbUIsSUFBbkI7QUFBd0JBLGVBQUEsR0FBZ0I4WixJQUFoQjtBQUFxQjtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJRztBQUNIO0FBQ0E7O0FBQ0EsU0FBU0EsSUFBVCxHQUFlO0FBQUMsUUFBTXZULEdBQUcsR0FBQ2dELE1BQU0sQ0FBQ3dRLE1BQVAsQ0FBYyxJQUFkLENBQVY7QUFBOEIsU0FBTTtBQUFDcEQsTUFBRSxDQUFDNUgsSUFBRCxFQUFNaUwsT0FBTixFQUFjO0FBQUM7QUFBQyxPQUFDelQsR0FBRyxDQUFDd0ksSUFBRCxDQUFILEtBQVl4SSxHQUFHLENBQUN3SSxJQUFELENBQUgsR0FBVSxFQUF0QixDQUFELEVBQTRCOUwsSUFBNUIsQ0FBaUMrVyxPQUFqQztBQUEyQyxLQUE5RDs7QUFBK0RDLE9BQUcsQ0FBQ2xMLElBQUQsRUFBTWlMLE9BQU4sRUFBYztBQUFDLFVBQUd6VCxHQUFHLENBQUN3SSxJQUFELENBQU4sRUFBYTtBQUFDeEksV0FBRyxDQUFDd0ksSUFBRCxDQUFILENBQVU4SyxNQUFWLENBQWlCdFQsR0FBRyxDQUFDd0ksSUFBRCxDQUFILENBQVV2QyxPQUFWLENBQWtCd04sT0FBbEIsTUFBNkIsQ0FBOUMsRUFBZ0QsQ0FBaEQ7QUFBb0Q7QUFBQyxLQUFwSjs7QUFBcUpFLFFBQUksQ0FBQ25MLElBQUQsRUFBTSxHQUFHb0wsSUFBVCxFQUFjO0FBQUM7QUFDNU47QUFBQyxPQUFDNVQsR0FBRyxDQUFDd0ksSUFBRCxDQUFILElBQVcsRUFBWixFQUFnQjVFLEtBQWhCLEdBQXdCdkcsR0FBeEIsQ0FBNEJvVyxPQUFPLElBQUU7QUFBQ0EsZUFBTyxDQUFDLEdBQUdHLElBQUosQ0FBUDtBQUFrQixPQUF4RDtBQUEyRDs7QUFEUixHQUFOO0FBQ2lCLEM7Ozs7Ozs7Ozs7O0FDZGxEOztBQUFBbmEsa0JBQUEsR0FBbUIsSUFBbkI7QUFBd0JBLHVCQUFBLEdBQXdCa1AsZUFBeEI7QUFBd0NsUCxpQkFBQSxHQUFrQnNQLFNBQWxCO0FBQTRCdFAsaUJBQUEsR0FBa0JvYSxTQUFsQjtBQUE0QnBhLG1CQUFBLEdBQW9CcWEsV0FBcEI7QUFBZ0NyYSxtQkFBQSxHQUFvQnFQLFdBQXBCO0FBQWdDclAsbUJBQUEsR0FBb0JzYSxXQUFwQjtBQUFnQ3RhLGtCQUFBLEdBQW1Cb0wsVUFBbkI7QUFBOEJwTCxxQkFBQSxHQUFzQnVhLGFBQXRCO0FBQW9DdmEsbUJBQUEsR0FBb0IrTixXQUFwQjtBQUFnQy9OLGVBQUEsR0FBZ0IsS0FBSyxDQUFyQjs7QUFBdUIsSUFBSXdhLHVCQUF1QixHQUFDemEsbUJBQU8sQ0FBQyw2R0FBRCxDQUFuQzs7QUFBZ0YsSUFBSTBhLFlBQVksR0FBQzFhLG1CQUFPLENBQUMscUZBQUQsQ0FBeEI7O0FBQXlELElBQUkyYSxvQkFBb0IsR0FBQzNhLG1CQUFPLENBQUMsZ0hBQUQsQ0FBaEM7O0FBQXVFLElBQUk0YSxvQkFBb0IsR0FBQzVhLG1CQUFPLENBQUMsNkdBQUQsQ0FBaEM7O0FBQWtFLElBQUk2YSxLQUFLLEdBQUM5YSxzQkFBc0IsQ0FBQ0MsbUJBQU8sQ0FBQyxpRUFBRCxDQUFSLENBQWhDOztBQUFxRCxJQUFJOGEsTUFBTSxHQUFDOWEsbUJBQU8sQ0FBQyxtRUFBRCxDQUFsQjs7QUFBK0IsSUFBSSthLFVBQVUsR0FBQy9hLG1CQUFPLENBQUMsK0ZBQUQsQ0FBdEI7O0FBQTZDLElBQUlnYixpQkFBaUIsR0FBQ2hiLG1CQUFPLENBQUMsK0dBQUQsQ0FBN0I7O0FBQTRELElBQUlpYixZQUFZLEdBQUNqYixtQkFBTyxDQUFDLGlHQUFELENBQXhCOztBQUFnRCxJQUFJa2IsZ0JBQWdCLEdBQUNuYixzQkFBc0IsQ0FBQ0MsbUJBQU8sQ0FBQyx1Q0FBRCxDQUFSLENBQTNDOztBQUFpRixJQUFJbWIsYUFBYSxHQUFDbmIsbUJBQU8sQ0FBQyxxR0FBRCxDQUF6Qjs7QUFBbUQsSUFBSW9iLFdBQVcsR0FBQ3BiLG1CQUFPLENBQUMsaUdBQUQsQ0FBdkI7O0FBQStDLFNBQVNELHNCQUFULENBQWdDc2IsR0FBaEMsRUFBb0M7QUFBQyxTQUFPQSxHQUFHLElBQUVBLEdBQUcsQ0FBQ0MsVUFBVCxHQUFvQkQsR0FBcEIsR0FBd0I7QUFBQzlaLFdBQU8sRUFBQzhaO0FBQVQsR0FBL0I7QUFBOEMsQyxDQUFBOzs7QUFDbm1DLElBQUlFLGtCQUFKOztBQUF1QixJQUFHblosS0FBSCxFQUFtQyxFQUFnRjs7QUFBQSxNQUFNb1osUUFBUSxHQUFDcFosTUFBQSxJQUFvQyxFQUFuRDs7QUFBc0QsU0FBU3FaLHNCQUFULEdBQWlDO0FBQUMsU0FBT2pTLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLElBQUkxRSxLQUFKLENBQVUsaUJBQVYsQ0FBZCxFQUEyQztBQUFDcU8sYUFBUyxFQUFDO0FBQVgsR0FBM0MsQ0FBUDtBQUFxRTs7QUFBQSxTQUFTc0ksYUFBVCxDQUF1QjFaLElBQXZCLEVBQTRCMlosTUFBNUIsRUFBbUM7QUFBQyxTQUFPQSxNQUFNLElBQUUzWixJQUFJLENBQUNxRCxVQUFMLENBQWdCLEdBQWhCLENBQVIsR0FBNkJyRCxJQUFJLEtBQUcsR0FBUCxHQUFXLENBQUMsR0FBRXlZLHVCQUF1QixDQUFDNUssMEJBQTNCLEVBQXVEOEwsTUFBdkQsQ0FBWCxHQUEyRSxHQUFFQSxNQUFPLEdBQUVDLGVBQWUsQ0FBQzVaLElBQUQsQ0FBZixLQUF3QixHQUF4QixHQUE0QkEsSUFBSSxDQUFDZ1YsU0FBTCxDQUFlLENBQWYsQ0FBNUIsR0FBOENoVixJQUFLLEVBQXRLLEdBQXdLQSxJQUEvSztBQUFxTDs7QUFBQSxTQUFTbU4sZUFBVCxDQUF5Qm5OLElBQXpCLEVBQThCdUosTUFBOUIsRUFBcUM2RCxPQUFyQyxFQUE2Q0MsYUFBN0MsRUFBMkQ7QUFBQyxNQUFHak4sS0FBSCxFQUFtQyxFQUF1Vjs7QUFBQSxTQUFPLEtBQVA7QUFBYzs7QUFBQSxTQUFTbU4sU0FBVCxDQUFtQnZOLElBQW5CLEVBQXdCdUosTUFBeEIsRUFBK0JpRSxhQUEvQixFQUE2QztBQUFDLE1BQUdwTixLQUFILEVBQW1DLEVBQWdSOztBQUFBLFNBQU9KLElBQVA7QUFBYTs7QUFBQSxTQUFTcVksU0FBVCxDQUFtQnJZLElBQW5CLEVBQXdCdUosTUFBeEIsRUFBK0I7QUFBQyxNQUFHbkosS0FBSCxFQUFtQyxFQUFrUzs7QUFBQSxTQUFPSixJQUFQO0FBQWE7O0FBQUEsU0FBUzRaLGVBQVQsQ0FBeUI1WixJQUF6QixFQUE4QjtBQUFDLFFBQU02WixVQUFVLEdBQUM3WixJQUFJLENBQUN5SyxPQUFMLENBQWEsR0FBYixDQUFqQjtBQUFtQyxRQUFNcVAsU0FBUyxHQUFDOVosSUFBSSxDQUFDeUssT0FBTCxDQUFhLEdBQWIsQ0FBaEI7O0FBQWtDLE1BQUdvUCxVQUFVLEdBQUMsQ0FBQyxDQUFaLElBQWVDLFNBQVMsR0FBQyxDQUFDLENBQTdCLEVBQStCO0FBQUM5WixRQUFJLEdBQUNBLElBQUksQ0FBQ2dWLFNBQUwsQ0FBZSxDQUFmLEVBQWlCNkUsVUFBVSxHQUFDLENBQUMsQ0FBWixHQUFjQSxVQUFkLEdBQXlCQyxTQUExQyxDQUFMO0FBQTJEOztBQUFBLFNBQU85WixJQUFQO0FBQWE7O0FBQUEsU0FBU3NZLFdBQVQsQ0FBcUJ0WSxJQUFyQixFQUEwQjtBQUFDQSxNQUFJLEdBQUM0WixlQUFlLENBQUM1WixJQUFELENBQXBCO0FBQTJCLFNBQU9BLElBQUksS0FBR3daLFFBQVAsSUFBaUJ4WixJQUFJLENBQUNxRCxVQUFMLENBQWdCbVcsUUFBUSxHQUFDLEdBQXpCLENBQXhCO0FBQXVEOztBQUFBLFNBQVNsTSxXQUFULENBQXFCdE4sSUFBckIsRUFBMEI7QUFBQztBQUN4L0QsU0FBTzBaLGFBQWEsQ0FBQzFaLElBQUQsRUFBTXdaLFFBQU4sQ0FBcEI7QUFBcUM7O0FBQUEsU0FBU2pCLFdBQVQsQ0FBcUJ2WSxJQUFyQixFQUEwQjtBQUFDQSxNQUFJLEdBQUNBLElBQUksQ0FBQ29JLEtBQUwsQ0FBV29SLFFBQVEsQ0FBQ3BZLE1BQXBCLENBQUw7QUFBaUMsTUFBRyxDQUFDcEIsSUFBSSxDQUFDcUQsVUFBTCxDQUFnQixHQUFoQixDQUFKLEVBQXlCckQsSUFBSSxHQUFFLElBQUdBLElBQUssRUFBZDtBQUFnQixTQUFPQSxJQUFQO0FBQWE7QUFBQTtBQUN2SjtBQUNBOzs7QUFBRyxTQUFTcUosVUFBVCxDQUFvQjBRLEdBQXBCLEVBQXdCO0FBQUM7QUFDNUIsTUFBR0EsR0FBRyxDQUFDMVcsVUFBSixDQUFlLEdBQWYsS0FBcUIwVyxHQUFHLENBQUMxVyxVQUFKLENBQWUsR0FBZixDQUFyQixJQUEwQzBXLEdBQUcsQ0FBQzFXLFVBQUosQ0FBZSxHQUFmLENBQTdDLEVBQWlFLE9BQU8sSUFBUDs7QUFBWSxNQUFHO0FBQUM7QUFDakYsVUFBTTJXLGNBQWMsR0FBQyxDQUFDLEdBQUVsQixNQUFNLENBQUNtQixpQkFBVixHQUFyQjtBQUFvRCxVQUFNQyxRQUFRLEdBQUMsSUFBSXpSLEdBQUosQ0FBUXNSLEdBQVIsRUFBWUMsY0FBWixDQUFmO0FBQTJDLFdBQU9FLFFBQVEsQ0FBQ0MsTUFBVCxLQUFrQkgsY0FBbEIsSUFBa0MxQixXQUFXLENBQUM0QixRQUFRLENBQUMxQyxRQUFWLENBQXBEO0FBQXlFLEdBRDNGLENBQzJGLE9BQU1wTSxDQUFOLEVBQVE7QUFBQyxXQUFPLEtBQVA7QUFBYztBQUFDOztBQUFBLFNBQVNvTixhQUFULENBQXVCN0csS0FBdkIsRUFBNkJ5SSxVQUE3QixFQUF3Q0MsS0FBeEMsRUFBOEM7QUFBQyxNQUFJQyxpQkFBaUIsR0FBQyxFQUF0QjtBQUF5QixRQUFNQyxZQUFZLEdBQUMsQ0FBQyxHQUFFbkIsV0FBVyxDQUFDb0IsYUFBZixFQUE4QjdJLEtBQTlCLENBQW5CO0FBQXdELFFBQU04SSxhQUFhLEdBQUNGLFlBQVksQ0FBQ0csTUFBakM7QUFBd0MsUUFBTUMsY0FBYyxHQUFDO0FBQzdYLEdBQUNQLFVBQVUsS0FBR3pJLEtBQWIsR0FBbUIsQ0FBQyxHQUFFd0gsYUFBYSxDQUFDeUIsZUFBakIsRUFBa0NMLFlBQWxDLEVBQWdESCxVQUFoRCxDQUFuQixHQUErRSxFQUFoRixLQUFxRjtBQUNyRjtBQUNBQyxPQUh3VztBQUdsV0MsbUJBQWlCLEdBQUMzSSxLQUFsQjtBQUF3QixRQUFNdEosTUFBTSxHQUFDYixNQUFNLENBQUMwRCxJQUFQLENBQVl1UCxhQUFaLENBQWI7O0FBQXdDLE1BQUcsQ0FBQ3BTLE1BQU0sQ0FBQ3dTLEtBQVAsQ0FBYUMsS0FBSyxJQUFFO0FBQUMsUUFBSXRMLEtBQUssR0FBQ21MLGNBQWMsQ0FBQ0csS0FBRCxDQUFkLElBQXVCLEVBQWpDO0FBQW9DLFVBQUs7QUFBQ0MsWUFBRDtBQUFRQztBQUFSLFFBQWtCUCxhQUFhLENBQUNLLEtBQUQsQ0FBcEMsQ0FBckMsQ0FBaUY7QUFDL0s7O0FBQ0EsUUFBSUcsUUFBUSxHQUFFLElBQUdGLE1BQU0sR0FBQyxLQUFELEdBQU8sRUFBRyxHQUFFRCxLQUFNLEdBQXpDOztBQUE0QyxRQUFHRSxRQUFILEVBQVk7QUFBQ0MsY0FBUSxHQUFFLEdBQUUsQ0FBQ3pMLEtBQUQsR0FBTyxHQUFQLEdBQVcsRUFBRyxJQUFHeUwsUUFBUyxHQUF0QztBQUEwQzs7QUFBQSxRQUFHRixNQUFNLElBQUUsQ0FBQ3RGLEtBQUssQ0FBQ0MsT0FBTixDQUFjbEcsS0FBZCxDQUFaLEVBQWlDQSxLQUFLLEdBQUMsQ0FBQ0EsS0FBRCxDQUFOO0FBQWMsV0FBTSxDQUFDd0wsUUFBUSxJQUFFRixLQUFLLElBQUlILGNBQXBCLE9BQXNDO0FBQzlMTCxxQkFBaUIsR0FBQ0EsaUJBQWlCLENBQUNsUSxPQUFsQixDQUEwQjZRLFFBQTFCLEVBQW1DRixNQUFNLEdBQUN2TCxLQUFLLENBQUMzTixHQUFOLEVBQVU7QUFDdEU7QUFDQTtBQUNBO0FBQ0FxWixXQUFPLElBQUVyUyxrQkFBa0IsQ0FBQ3FTLE9BQUQsQ0FKaUMsRUFJdEIzWSxJQUpzQixDQUlqQixHQUppQixDQUFELEdBSVhzRyxrQkFBa0IsQ0FBQzJHLEtBQUQsQ0FKaEQsS0FJMEQsR0FMNEUsQ0FBTjtBQUtoRSxHQVBSLENBQUosRUFPYztBQUFDOEsscUJBQWlCLEdBQUMsRUFBbEIsQ0FBRCxDQUFzQjtBQUMxRztBQUNBO0FBQ0M7O0FBQUEsU0FBTTtBQUFDalMsVUFBRDtBQUFROFMsVUFBTSxFQUFDYjtBQUFmLEdBQU47QUFBeUM7O0FBQUEsU0FBU2Msa0JBQVQsQ0FBNEJmLEtBQTVCLEVBQWtDaFMsTUFBbEMsRUFBeUM7QUFBQyxRQUFNZ1QsYUFBYSxHQUFDLEVBQXBCO0FBQXVCN1QsUUFBTSxDQUFDMEQsSUFBUCxDQUFZbVAsS0FBWixFQUFtQmxQLE9BQW5CLENBQTJCdEQsR0FBRyxJQUFFO0FBQUMsUUFBRyxDQUFDUSxNQUFNLENBQUNwRCxRQUFQLENBQWdCNEMsR0FBaEIsQ0FBSixFQUF5QjtBQUFDd1QsbUJBQWEsQ0FBQ3hULEdBQUQsQ0FBYixHQUFtQndTLEtBQUssQ0FBQ3hTLEdBQUQsQ0FBeEI7QUFBK0I7QUFBQyxHQUEzRjtBQUE2RixTQUFPd1QsYUFBUDtBQUFzQjtBQUFBO0FBQzlOO0FBQ0E7QUFDQTs7O0FBQUcsU0FBU3JQLFdBQVQsQ0FBcUI3QyxNQUFyQixFQUE0Qm5CLElBQTVCLEVBQWlDc1QsU0FBakMsRUFBMkM7QUFBQztBQUMvQyxNQUFJQyxJQUFKO0FBQVMsUUFBTUMsV0FBVyxHQUFDLE9BQU94VCxJQUFQLEtBQWMsUUFBZCxHQUF1QkEsSUFBdkIsR0FBNEIsQ0FBQyxHQUFFOFEsTUFBTSxDQUFDMkMsb0JBQVYsRUFBZ0N6VCxJQUFoQyxDQUE5Qzs7QUFBb0YsTUFBRztBQUFDdVQsUUFBSSxHQUFDLElBQUk5UyxHQUFKLENBQVErUyxXQUFXLENBQUNuWSxVQUFaLENBQXVCLEdBQXZCLElBQTRCOEYsTUFBTSxDQUFDdVMsTUFBbkMsR0FBMEN2UyxNQUFNLENBQUNxTyxRQUF6RCxFQUFrRSxVQUFsRSxDQUFMO0FBQW9GLEdBQXhGLENBQXdGLE9BQU1wTSxDQUFOLEVBQVE7QUFBQztBQUM5TG1RLFFBQUksR0FBQyxJQUFJOVMsR0FBSixDQUFRLEdBQVIsRUFBWSxVQUFaLENBQUw7QUFBOEIsR0FGZ0IsQ0FFaEI7OztBQUM5QixNQUFHLENBQUNZLFVBQVUsQ0FBQ21TLFdBQUQsQ0FBZCxFQUE0QjtBQUFDLFdBQU9GLFNBQVMsR0FBQyxDQUFDRSxXQUFELENBQUQsR0FBZUEsV0FBL0I7QUFBNEM7O0FBQUEsTUFBRztBQUFDLFVBQU1HLFFBQVEsR0FBQyxJQUFJbFQsR0FBSixDQUFRK1MsV0FBUixFQUFvQkQsSUFBcEIsQ0FBZjtBQUF5Q0ksWUFBUSxDQUFDbkUsUUFBVCxHQUFrQixDQUFDLEdBQUVpQix1QkFBdUIsQ0FBQzVLLDBCQUEzQixFQUF1RDhOLFFBQVEsQ0FBQ25FLFFBQWhFLENBQWxCO0FBQTRGLFFBQUlvRSxjQUFjLEdBQUMsRUFBbkI7O0FBQXNCLFFBQUcsQ0FBQyxHQUFFN0MsVUFBVSxDQUFDOEMsY0FBZCxFQUE4QkYsUUFBUSxDQUFDbkUsUUFBdkMsS0FBa0RtRSxRQUFRLENBQUNHLFlBQTNELElBQXlFUixTQUE1RSxFQUFzRjtBQUFDLFlBQU1qQixLQUFLLEdBQUMsQ0FBQyxHQUFFcEIsWUFBWSxDQUFDOEMsc0JBQWhCLEVBQXdDSixRQUFRLENBQUNHLFlBQWpELENBQVo7QUFBMkUsWUFBSztBQUFDWCxjQUFEO0FBQVE5UztBQUFSLFVBQWdCbVEsYUFBYSxDQUFDbUQsUUFBUSxDQUFDbkUsUUFBVixFQUFtQm1FLFFBQVEsQ0FBQ25FLFFBQTVCLEVBQXFDNkMsS0FBckMsQ0FBbEM7O0FBQThFLFVBQUdjLE1BQUgsRUFBVTtBQUFDUyxzQkFBYyxHQUFDLENBQUMsR0FBRTlDLE1BQU0sQ0FBQzJDLG9CQUFWLEVBQWdDO0FBQUNqRSxrQkFBUSxFQUFDMkQsTUFBVjtBQUFpQmEsY0FBSSxFQUFDTCxRQUFRLENBQUNLLElBQS9CO0FBQW9DM0IsZUFBSyxFQUFDZSxrQkFBa0IsQ0FBQ2YsS0FBRCxFQUFPaFMsTUFBUDtBQUE1RCxTQUFoQyxDQUFmO0FBQTZIO0FBQUMsS0FBcmhCLENBQXFoQjs7O0FBQ2ptQixVQUFNeUQsWUFBWSxHQUFDNlAsUUFBUSxDQUFDeEIsTUFBVCxLQUFrQm9CLElBQUksQ0FBQ3BCLE1BQXZCLEdBQThCd0IsUUFBUSxDQUFDM1QsSUFBVCxDQUFjSSxLQUFkLENBQW9CdVQsUUFBUSxDQUFDeEIsTUFBVCxDQUFnQi9ZLE1BQXBDLENBQTlCLEdBQTBFdWEsUUFBUSxDQUFDM1QsSUFBdEc7QUFBMkcsV0FBT3NULFNBQVMsR0FBQyxDQUFDeFAsWUFBRCxFQUFjOFAsY0FBYyxJQUFFOVAsWUFBOUIsQ0FBRCxHQUE2Q0EsWUFBN0Q7QUFBMkUsR0FEN0csQ0FDNkcsT0FBTVYsQ0FBTixFQUFRO0FBQUMsV0FBT2tRLFNBQVMsR0FBQyxDQUFDRSxXQUFELENBQUQsR0FBZUEsV0FBL0I7QUFBNEM7QUFBQzs7QUFBQSxTQUFTUyxXQUFULENBQXFCbEMsR0FBckIsRUFBeUI7QUFBQyxRQUFNSSxNQUFNLEdBQUMsQ0FBQyxHQUFFckIsTUFBTSxDQUFDbUIsaUJBQVYsR0FBYjtBQUE0QyxTQUFPRixHQUFHLENBQUMxVyxVQUFKLENBQWU4VyxNQUFmLElBQXVCSixHQUFHLENBQUMvRSxTQUFKLENBQWNtRixNQUFNLENBQUMvWSxNQUFyQixDQUF2QixHQUFvRDJZLEdBQTNEO0FBQWdFOztBQUFBLFNBQVNtQyxZQUFULENBQXNCL1MsTUFBdEIsRUFBNkI0USxHQUE3QixFQUFpQ2hTLEVBQWpDLEVBQW9DO0FBQUM7QUFDdlo7QUFDQSxNQUFHLENBQUMrRCxZQUFELEVBQWNDLFVBQWQsSUFBMEJDLFdBQVcsQ0FBQzdDLE1BQUQsRUFBUTRRLEdBQVIsRUFBWSxJQUFaLENBQXhDO0FBQTBELFFBQU1JLE1BQU0sR0FBQyxDQUFDLEdBQUVyQixNQUFNLENBQUNtQixpQkFBVixHQUFiO0FBQTRDLFFBQU1rQyxhQUFhLEdBQUNyUSxZQUFZLENBQUN6SSxVQUFiLENBQXdCOFcsTUFBeEIsQ0FBcEI7QUFBb0QsUUFBTWlDLFdBQVcsR0FBQ3JRLFVBQVUsSUFBRUEsVUFBVSxDQUFDMUksVUFBWCxDQUFzQjhXLE1BQXRCLENBQTlCO0FBQTREck8sY0FBWSxHQUFDbVEsV0FBVyxDQUFDblEsWUFBRCxDQUF4QjtBQUF1Q0MsWUFBVSxHQUFDQSxVQUFVLEdBQUNrUSxXQUFXLENBQUNsUSxVQUFELENBQVosR0FBeUJBLFVBQTlDO0FBQXlELFFBQU1zUSxXQUFXLEdBQUNGLGFBQWEsR0FBQ3JRLFlBQUQsR0FBY3dCLFdBQVcsQ0FBQ3hCLFlBQUQsQ0FBeEQ7QUFBdUUsUUFBTXdRLFVBQVUsR0FBQ3ZVLEVBQUUsR0FBQ2tVLFdBQVcsQ0FBQ2pRLFdBQVcsQ0FBQzdDLE1BQUQsRUFBUXBCLEVBQVIsQ0FBWixDQUFaLEdBQXFDZ0UsVUFBVSxJQUFFRCxZQUFwRTtBQUFpRixTQUFNO0FBQUNpTyxPQUFHLEVBQUNzQyxXQUFMO0FBQWlCdFUsTUFBRSxFQUFDcVUsV0FBVyxHQUFDRSxVQUFELEdBQVloUCxXQUFXLENBQUNnUCxVQUFEO0FBQXRELEdBQU47QUFBMkU7O0FBQUEsU0FBU0MsbUJBQVQsQ0FBNkIvRSxRQUE3QixFQUFzQ2dGLEtBQXRDLEVBQTRDO0FBQUMsUUFBTUMsYUFBYSxHQUFDLENBQUMsR0FBRWhFLHVCQUF1QixDQUFDOUssdUJBQTNCLEVBQW9ELENBQUMsR0FBRWdMLG9CQUFvQixDQUFDK0QsbUJBQXhCLEVBQTZDbEYsUUFBN0MsQ0FBcEQsQ0FBcEI7O0FBQWdJLE1BQUdpRixhQUFhLEtBQUcsTUFBaEIsSUFBd0JBLGFBQWEsS0FBRyxTQUEzQyxFQUFxRDtBQUFDLFdBQU9qRixRQUFQO0FBQWlCLEdBQXhNLENBQXdNOzs7QUFDN3dCLE1BQUcsQ0FBQ2dGLEtBQUssQ0FBQ3ZYLFFBQU4sQ0FBZXdYLGFBQWYsQ0FBSixFQUFrQztBQUFDO0FBQ25DRCxTQUFLLENBQUM1RSxJQUFOLENBQVcrRSxJQUFJLElBQUU7QUFBQyxVQUFHLENBQUMsR0FBRTVELFVBQVUsQ0FBQzhDLGNBQWQsRUFBOEJjLElBQTlCLEtBQXFDLENBQUMsR0FBRXZELFdBQVcsQ0FBQ29CLGFBQWYsRUFBOEJtQyxJQUE5QixFQUFvQ0MsRUFBcEMsQ0FBdUNoSixJQUF2QyxDQUE0QzZJLGFBQTVDLENBQXhDLEVBQW1HO0FBQUNqRixnQkFBUSxHQUFDbUYsSUFBVDtBQUFjLGVBQU8sSUFBUDtBQUFhO0FBQUMsS0FBbEo7QUFBcUo7O0FBQUEsU0FBTSxDQUFDLEdBQUVsRSx1QkFBdUIsQ0FBQzlLLHVCQUEzQixFQUFvRDZKLFFBQXBELENBQU47QUFBcUU7O0FBQUEsTUFBTXFGLHVCQUF1QixHQUFDemMsTUFBQSxJQUEwRyxDQUF4STtBQUN0SSxNQUFNMGMsa0JBQWtCLEdBQUNsTSxNQUFNLENBQUMsb0JBQUQsQ0FBL0I7O0FBQXNELFNBQVNtTSxVQUFULENBQW9CaEQsR0FBcEIsRUFBd0JpRCxRQUF4QixFQUFpQztBQUFDLFNBQU92SyxLQUFLLENBQUNzSCxHQUFELEVBQUs7QUFBQztBQUM5TDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBa0QsZUFBVyxFQUFDO0FBWGlMLEdBQUwsQ0FBTCxDQVd2SnZaLElBWHVKLENBV2xKME0sR0FBRyxJQUFFO0FBQUMsUUFBRyxDQUFDQSxHQUFHLENBQUNzQyxFQUFSLEVBQVc7QUFBQyxVQUFHc0ssUUFBUSxHQUFDLENBQVQsSUFBWTVNLEdBQUcsQ0FBQzhNLE1BQUosSUFBWSxHQUEzQixFQUErQjtBQUFDLGVBQU9ILFVBQVUsQ0FBQ2hELEdBQUQsRUFBS2lELFFBQVEsR0FBQyxDQUFkLENBQWpCO0FBQW1DOztBQUFBLFVBQUc1TSxHQUFHLENBQUM4TSxNQUFKLEtBQWEsR0FBaEIsRUFBb0I7QUFBQyxlQUFPOU0sR0FBRyxDQUFDK00sSUFBSixHQUFXelosSUFBWCxDQUFnQjBaLElBQUksSUFBRTtBQUFDLGNBQUdBLElBQUksQ0FBQ0MsUUFBUixFQUFpQjtBQUFDLG1CQUFNO0FBQUNBLHNCQUFRLEVBQUNQO0FBQVYsYUFBTjtBQUFxQzs7QUFBQSxnQkFBTSxJQUFJL1osS0FBSixDQUFXLDZCQUFYLENBQU47QUFBZ0QsU0FBOUgsQ0FBUDtBQUF3STs7QUFBQSxZQUFNLElBQUlBLEtBQUosQ0FBVyw2QkFBWCxDQUFOO0FBQWdEOztBQUFBLFdBQU9xTixHQUFHLENBQUMrTSxJQUFKLEVBQVA7QUFBbUIsR0FYbkssQ0FBUDtBQVc2Szs7QUFBQSxTQUFTRyxhQUFULENBQXVCQyxRQUF2QixFQUFnQ0MsY0FBaEMsRUFBK0M7QUFBQyxTQUFPVCxVQUFVLENBQUNRLFFBQUQsRUFBVUMsY0FBYyxHQUFDLENBQUQsR0FBRyxDQUEzQixDQUFWLENBQXdDL1osS0FBeEMsQ0FBOENpRixHQUFHLElBQUU7QUFBQztBQUNwYztBQUNBO0FBQ0EsUUFBRyxDQUFDOFUsY0FBSixFQUFtQjtBQUFDLE9BQUMsR0FBRTlFLFlBQVksQ0FBQy9KLGNBQWhCLEVBQWdDakcsR0FBaEM7QUFBc0M7O0FBQUEsVUFBTUEsR0FBTjtBQUFXLEdBSDJVLENBQVA7QUFHalU7O0FBQUEsTUFBTStVLE1BQU4sQ0FBWTtBQUFDO0FBQ3JGO0FBQ0E7QUFBTTtBQUNOO0FBQ0FDLGFBQVcsQ0FBQ0MsU0FBRCxFQUFXQyxNQUFYLEVBQWtCQyxHQUFsQixFQUFzQjtBQUFDQyxnQkFBRDtBQUFjQyxjQUFkO0FBQXlCQyxPQUF6QjtBQUE2QkMsV0FBN0I7QUFBcUNDLGFBQXJDO0FBQStDeFYsT0FBL0M7QUFBbUR5VixnQkFBbkQ7QUFBZ0VDLGNBQWhFO0FBQTJFN1UsVUFBM0U7QUFBa0Y2RCxXQUFsRjtBQUEwRkksaUJBQTFGO0FBQXdHSCxpQkFBeEc7QUFBc0hnUjtBQUF0SCxHQUF0QixFQUF1SjtBQUFDLFNBQUsxTSxLQUFMLEdBQVcsS0FBSyxDQUFoQjtBQUFrQixTQUFLNkYsUUFBTCxHQUFjLEtBQUssQ0FBbkI7QUFBcUIsU0FBSzZDLEtBQUwsR0FBVyxLQUFLLENBQWhCO0FBQWtCLFNBQUtxQixNQUFMLEdBQVksS0FBSyxDQUFqQjtBQUFtQixTQUFLbEMsUUFBTCxHQUFjLEtBQUssQ0FBbkI7QUFBcUIsU0FBSzhFLFVBQUwsR0FBZ0IsS0FBSyxDQUFyQjtBQUF1QixTQUFLQyxHQUFMLEdBQVMsRUFBVDtBQUFZLFNBQUtDLEdBQUwsR0FBUyxFQUFUO0FBQVksU0FBS0MsR0FBTCxHQUFTLEtBQUssQ0FBZDtBQUFnQixTQUFLQyxHQUFMLEdBQVMsS0FBSyxDQUFkO0FBQWdCLFNBQUtYLFVBQUwsR0FBZ0IsS0FBSyxDQUFyQjtBQUF1QixTQUFLWSxJQUFMLEdBQVUsS0FBSyxDQUFmO0FBQWlCLFNBQUtsSyxNQUFMLEdBQVksS0FBSyxDQUFqQjtBQUFtQixTQUFLbUssUUFBTCxHQUFjLEtBQUssQ0FBbkI7QUFBcUIsU0FBS0MsS0FBTCxHQUFXLEtBQUssQ0FBaEI7QUFBa0IsU0FBS1QsVUFBTCxHQUFnQixLQUFLLENBQXJCO0FBQXVCLFNBQUtVLGNBQUwsR0FBb0IsS0FBSyxDQUF6QjtBQUEyQixTQUFLQyxRQUFMLEdBQWMsS0FBSyxDQUFuQjtBQUFxQixTQUFLeFYsTUFBTCxHQUFZLEtBQUssQ0FBakI7QUFBbUIsU0FBSzZELE9BQUwsR0FBYSxLQUFLLENBQWxCO0FBQW9CLFNBQUtJLGFBQUwsR0FBbUIsS0FBSyxDQUF4QjtBQUEwQixTQUFLSCxhQUFMLEdBQW1CLEtBQUssQ0FBeEI7QUFBMEIsU0FBSzJSLE9BQUwsR0FBYSxLQUFLLENBQWxCO0FBQW9CLFNBQUtYLFNBQUwsR0FBZSxLQUFLLENBQXBCO0FBQXNCLFNBQUtuUixjQUFMLEdBQW9CLEtBQUssQ0FBekI7QUFBMkIsU0FBSytSLElBQUwsR0FBVSxDQUFWOztBQUFZLFNBQUtDLFVBQUwsR0FBZ0IvVSxDQUFDLElBQUU7QUFBQyxZQUFNZ1YsS0FBSyxHQUFDaFYsQ0FBQyxDQUFDZ1YsS0FBZDs7QUFBb0IsVUFBRyxDQUFDQSxLQUFKLEVBQVU7QUFBQztBQUMzdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQUs7QUFBQzNILGtCQUFEO0FBQVU2QztBQUFWLFlBQWlCLElBQXRCO0FBQTJCLGFBQUsrRSxXQUFMLENBQWlCLGNBQWpCLEVBQWdDLENBQUMsR0FBRXRHLE1BQU0sQ0FBQzJDLG9CQUFWLEVBQWdDO0FBQUNqRSxrQkFBUSxFQUFDbEssV0FBVyxDQUFDa0ssUUFBRCxDQUFyQjtBQUFnQzZDO0FBQWhDLFNBQWhDLENBQWhDLEVBQXdHLENBQUMsR0FBRXZCLE1BQU0sQ0FBQ3VHLE1BQVYsR0FBeEc7QUFBNkg7QUFBUTs7QUFBQSxVQUFHLENBQUNGLEtBQUssQ0FBQ0csR0FBVixFQUFjO0FBQUM7QUFBUTs7QUFBQSxVQUFJQyxZQUFKO0FBQWlCLFlBQUs7QUFBQ3hGLFdBQUQ7QUFBS2hTLFVBQUw7QUFBUXFCLGVBQVI7QUFBZ0JvVztBQUFoQixVQUFxQkwsS0FBMUI7O0FBQWdDLFVBQUcvZSxLQUFILEVBQXlDLEVBRWpKOztBQUFBLFdBQUs2ZSxJQUFMLEdBQVVPLEdBQVY7QUFBYyxZQUFLO0FBQUNoSTtBQUFELFVBQVcsQ0FBQyxHQUFFd0IsaUJBQWlCLENBQUN5RyxnQkFBckIsRUFBdUMxRixHQUF2QyxDQUFoQixDQVg2aUIsQ0FXamY7QUFDMU07O0FBQ0EsVUFBRyxLQUFLOEUsS0FBTCxJQUFZOVcsRUFBRSxLQUFHLEtBQUsyVCxNQUF0QixJQUE4QmxFLFFBQVEsS0FBRyxLQUFLQSxRQUFqRCxFQUEwRDtBQUFDO0FBQVEsT0Fid25CLENBYXhuQjtBQUNuRTs7O0FBQ0EsVUFBRyxLQUFLbUgsSUFBTCxJQUFXLENBQUMsS0FBS0EsSUFBTCxDQUFVUSxLQUFWLENBQWYsRUFBZ0M7QUFBQztBQUFROztBQUFBLFdBQUtPLE1BQUwsQ0FBWSxjQUFaLEVBQTJCM0YsR0FBM0IsRUFBK0JoUyxFQUEvQixFQUFrQ1AsTUFBTSxDQUFDQyxNQUFQLENBQWMsRUFBZCxFQUFpQjJCLE9BQWpCLEVBQXlCO0FBQUNpQixlQUFPLEVBQUNqQixPQUFPLENBQUNpQixPQUFSLElBQWlCLEtBQUswVSxRQUEvQjtBQUF3Q3hWLGNBQU0sRUFBQ0gsT0FBTyxDQUFDRyxNQUFSLElBQWdCLEtBQUtpRTtBQUFwRSxPQUF6QixDQUFsQyxFQUErSStSLFlBQS9JO0FBQThKLEtBZmllLENBQXRnQixDQWVzQzs7O0FBQ3hNLFNBQUs1TixLQUFMLEdBQVcsQ0FBQyxHQUFFOEcsdUJBQXVCLENBQUM5Syx1QkFBM0IsRUFBb0RnUSxTQUFwRCxDQUFYLENBaEJrSyxDQWdCeEY7O0FBQzFFLFNBQUtXLFVBQUwsR0FBZ0IsRUFBaEIsQ0FqQmtLLENBaUIvSTtBQUNuQjtBQUNBOztBQUNBLFFBQUdYLFNBQVMsS0FBRyxTQUFmLEVBQXlCO0FBQUMsV0FBS1csVUFBTCxDQUFnQixLQUFLM00sS0FBckIsSUFBNEI7QUFBQ3VNLGlCQUFEO0FBQVd5QixlQUFPLEVBQUMsSUFBbkI7QUFBd0JoVixhQUFLLEVBQUNtVCxZQUE5QjtBQUEyQ3BWLFdBQTNDO0FBQStDa1gsZUFBTyxFQUFDOUIsWUFBWSxJQUFFQSxZQUFZLENBQUM4QixPQUFsRjtBQUEwRkMsZUFBTyxFQUFDL0IsWUFBWSxJQUFFQSxZQUFZLENBQUMrQjtBQUE3SCxPQUE1QjtBQUFtSzs7QUFBQSxTQUFLdkIsVUFBTCxDQUFnQixPQUFoQixJQUF5QjtBQUFDSixlQUFTLEVBQUNGLEdBQVg7QUFBZTNMLGlCQUFXLEVBQUM7QUFBQztBQUFEO0FBQTNCLEtBQXpCLENBcEIzQixDQW9Cb0k7QUFDdFM7O0FBQ0EsU0FBS29DLE1BQUwsR0FBWWdKLE1BQU0sQ0FBQ2hKLE1BQW5CO0FBQTBCLFNBQUtzSixVQUFMLEdBQWdCQSxVQUFoQjtBQUEyQixTQUFLdkcsUUFBTCxHQUFjbUcsU0FBZDtBQUF3QixTQUFLdEQsS0FBTCxHQUFXdUQsTUFBWCxDQXRCcUYsQ0FzQm5FO0FBQy9GOztBQUNBLFVBQU1rQyxpQkFBaUIsR0FBQyxDQUFDLEdBQUUvRyxVQUFVLENBQUM4QyxjQUFkLEVBQThCOEIsU0FBOUIsS0FBMEM1UCxJQUFJLENBQUNnUyxhQUFMLENBQW1CQyxVQUFyRjs7QUFBZ0csU0FBS3RFLE1BQUwsR0FBWW9FLGlCQUFpQixHQUFDbkMsU0FBRCxHQUFXRSxHQUF4QztBQUE0QyxTQUFLckUsUUFBTCxHQUFjQSxRQUFkO0FBQXVCLFNBQUtpRixHQUFMLEdBQVNOLFlBQVQ7QUFBc0IsU0FBS08sR0FBTCxHQUFTLElBQVQ7QUFBYyxTQUFLRSxRQUFMLEdBQWNYLE9BQWQsQ0F4QnJDLENBd0IyRDtBQUM3Tjs7QUFDQSxTQUFLWSxLQUFMLEdBQVcsSUFBWDtBQUFnQixTQUFLVCxVQUFMLEdBQWdCQSxVQUFoQjtBQUEyQixTQUFLWSxPQUFMLEdBQWEsQ0FBQyxFQUFFalIsSUFBSSxDQUFDZ1MsYUFBTCxDQUFtQkUsSUFBbkIsSUFBeUJsUyxJQUFJLENBQUNnUyxhQUFMLENBQW1CRyxHQUE1QyxJQUFpRCxDQUFDSixpQkFBRCxJQUFvQixDQUFDL1IsSUFBSSxDQUFDb1MsUUFBTCxDQUFjQyxNQUFuQyxJQUEyQyxDQUFDaGdCLEtBQS9GLENBQWQ7QUFBOEksU0FBS2llLFNBQUwsR0FBZSxDQUFDLENBQUNBLFNBQWpCO0FBQTJCLFNBQUtuUixjQUFMLEdBQW9CLEtBQXBCOztBQUEwQixRQUFHOU0sS0FBSCxFQUFtQyxFQUEyTDs7QUFBQSxlQUErQixFQU14WDtBQUFDOztBQUFBaWdCLFFBQU0sR0FBRTtBQUFDelEsVUFBTSxDQUFDdVEsUUFBUCxDQUFnQkUsTUFBaEI7QUFBMEI7QUFBQTtBQUN2SjtBQUNBOzs7QUFBS0MsTUFBSSxHQUFFO0FBQUMxUSxVQUFNLENBQUMyUSxPQUFQLENBQWVELElBQWY7QUFBdUI7QUFBQTtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFBS3BmLE1BQUksQ0FBQzZZLEdBQUQsRUFBS2hTLEVBQUwsRUFBUXFCLE9BQU8sR0FBQyxFQUFoQixFQUFtQjtBQUFDLFFBQUdoSixLQUFILEVBQXlDLEVBR3lEOztBQUFBO0FBQUMsS0FBQztBQUFDMlosU0FBRDtBQUFLaFM7QUFBTCxRQUFTbVUsWUFBWSxDQUFDLElBQUQsRUFBTW5DLEdBQU4sRUFBVWhTLEVBQVYsQ0FBdEI7QUFBcUMsV0FBTyxLQUFLMlgsTUFBTCxDQUFZLFdBQVosRUFBd0IzRixHQUF4QixFQUE0QmhTLEVBQTVCLEVBQStCcUIsT0FBL0IsQ0FBUDtBQUFnRDtBQUFBO0FBQ3JOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUFLZ0IsU0FBTyxDQUFDMlAsR0FBRCxFQUFLaFMsRUFBTCxFQUFRcUIsT0FBTyxHQUFDLEVBQWhCLEVBQW1CO0FBQUM7QUFBQyxLQUFDO0FBQUMyUSxTQUFEO0FBQUtoUztBQUFMLFFBQVNtVSxZQUFZLENBQUMsSUFBRCxFQUFNbkMsR0FBTixFQUFVaFMsRUFBVixDQUF0QjtBQUFxQyxXQUFPLEtBQUsyWCxNQUFMLENBQVksY0FBWixFQUEyQjNGLEdBQTNCLEVBQStCaFMsRUFBL0IsRUFBa0NxQixPQUFsQyxDQUFQO0FBQW1EOztBQUFBLFFBQU1zVyxNQUFOLENBQWFjLE1BQWIsRUFBb0J6RyxHQUFwQixFQUF3QmhTLEVBQXhCLEVBQTJCcUIsT0FBM0IsRUFBbUNtVyxZQUFuQyxFQUFnRDtBQUFDLFFBQUcsQ0FBQ2xXLFVBQVUsQ0FBQzBRLEdBQUQsQ0FBZCxFQUFvQjtBQUFDbkssWUFBTSxDQUFDdVEsUUFBUCxDQUFnQm5ZLElBQWhCLEdBQXFCK1IsR0FBckI7QUFBeUIsYUFBTyxLQUFQO0FBQWM7O0FBQUEsVUFBTTBHLGlCQUFpQixHQUFDMUcsR0FBRyxLQUFHaFMsRUFBTixJQUFVcUIsT0FBTyxDQUFDc1gsRUFBbEIsSUFBc0J0WCxPQUFPLENBQUN1WCxrQkFBdEQsQ0FBN0QsQ0FBc0k7QUFDL1M7O0FBQ0EsUUFBR3ZYLE9BQU8sQ0FBQ3NYLEVBQVgsRUFBYztBQUFDLFdBQUsxQixPQUFMLEdBQWEsSUFBYjtBQUFtQjs7QUFBQSxRQUFJNEIsWUFBWSxHQUFDeFgsT0FBTyxDQUFDRyxNQUFSLEtBQWlCLEtBQUtBLE1BQXZDOztBQUE4QyxRQUFHbkosS0FBSCxFQUFtQyxzQkFXbkQ7O0FBQUEsUUFBRyxDQUFDZ0osT0FBTyxDQUFDc1gsRUFBWixFQUFlO0FBQUMsV0FBSzdCLEtBQUwsR0FBVyxLQUFYO0FBQWtCLEtBYnVFLENBYXZFOzs7QUFDbEcsUUFBRy9GLE1BQU0sQ0FBQytILEVBQVYsRUFBYTtBQUFDQyxpQkFBVyxDQUFDQyxJQUFaLENBQWlCLGFBQWpCO0FBQWlDOztBQUFBLFVBQUs7QUFBQzFXLGFBQU8sR0FBQztBQUFULFFBQWdCakIsT0FBckI7QUFBNkIsVUFBTTRYLFVBQVUsR0FBQztBQUFDM1c7QUFBRCxLQUFqQjs7QUFBMkIsUUFBRyxLQUFLeVUsY0FBUixFQUF1QjtBQUFDLFdBQUttQyxrQkFBTCxDQUF3QixLQUFLbkMsY0FBN0IsRUFBNENrQyxVQUE1QztBQUF5RDs7QUFBQWpaLE1BQUUsR0FBQ3VGLFdBQVcsQ0FBQ0MsU0FBUyxDQUFDK0ssV0FBVyxDQUFDdlEsRUFBRCxDQUFYLEdBQWdCd1EsV0FBVyxDQUFDeFEsRUFBRCxDQUEzQixHQUFnQ0EsRUFBakMsRUFBb0NxQixPQUFPLENBQUNHLE1BQTVDLEVBQW1ELEtBQUtpRSxhQUF4RCxDQUFWLENBQWQ7QUFBZ0csVUFBTTBULFNBQVMsR0FBQzdJLFNBQVMsQ0FBQ0MsV0FBVyxDQUFDdlEsRUFBRCxDQUFYLEdBQWdCd1EsV0FBVyxDQUFDeFEsRUFBRCxDQUEzQixHQUFnQ0EsRUFBakMsRUFBb0MsS0FBS3dCLE1BQXpDLENBQXpCO0FBQTBFLFNBQUt1VixjQUFMLEdBQW9CL1csRUFBcEIsQ0FkekwsQ0FjZ047QUFDelg7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsUUFBRyxDQUFDcUIsT0FBTyxDQUFDc1gsRUFBVCxJQUFhLEtBQUtTLGVBQUwsQ0FBcUJELFNBQXJCLENBQWhCLEVBQWdEO0FBQUMsV0FBS3hGLE1BQUwsR0FBWXdGLFNBQVo7QUFBc0J6RCxZQUFNLENBQUNoSixNQUFQLENBQWMwRCxJQUFkLENBQW1CLGlCQUFuQixFQUFxQ3BRLEVBQXJDLEVBQXdDaVosVUFBeEMsRUFBdkIsQ0FBMkU7O0FBQzNILFdBQUs1QixXQUFMLENBQWlCb0IsTUFBakIsRUFBd0J6RyxHQUF4QixFQUE0QmhTLEVBQTVCLEVBQStCcUIsT0FBL0I7QUFBd0MsV0FBS2dZLFlBQUwsQ0FBa0JGLFNBQWxCO0FBQTZCLFdBQUtHLE1BQUwsQ0FBWSxLQUFLL0MsVUFBTCxDQUFnQixLQUFLM00sS0FBckIsQ0FBWixFQUF3QyxJQUF4QztBQUE4QzhMLFlBQU0sQ0FBQ2hKLE1BQVAsQ0FBYzBELElBQWQsQ0FBbUIsb0JBQW5CLEVBQXdDcFEsRUFBeEMsRUFBMkNpWixVQUEzQztBQUF1RCxhQUFPLElBQVA7QUFBYTs7QUFBQSxRQUFJTSxNQUFNLEdBQUMsQ0FBQyxHQUFFdEksaUJBQWlCLENBQUN5RyxnQkFBckIsRUFBdUMxRixHQUF2QyxDQUFYO0FBQXVELFFBQUc7QUFBQ3ZDLGNBQUQ7QUFBVTZDO0FBQVYsUUFBaUJpSCxNQUFwQixDQXBCckUsQ0FvQmdHO0FBQ3pRO0FBQ0E7O0FBQ0EsUUFBSTlFLEtBQUosRUFBVStFLFFBQVY7O0FBQW1CLFFBQUc7QUFBQy9FLFdBQUssR0FBQyxNQUFNLEtBQUt1QixVQUFMLENBQWdCeUQsV0FBaEIsRUFBWjtBQUEwQyxPQUFDO0FBQUNDLGtCQUFVLEVBQUNGO0FBQVosVUFBc0IsTUFBSyxDQUFDLEdBQUU3SSxZQUFZLENBQUM3SixzQkFBaEIsR0FBNUI7QUFBd0UsS0FBdEgsQ0FBc0gsT0FBTW5HLEdBQU4sRUFBVTtBQUFDO0FBQ3BKO0FBQ0FrSCxZQUFNLENBQUN1USxRQUFQLENBQWdCblksSUFBaEIsR0FBcUJELEVBQXJCO0FBQXdCLGFBQU8sS0FBUDtBQUFjLEtBekJtSSxDQXlCbkk7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLFFBQUcsQ0FBQyxLQUFLMlosUUFBTCxDQUFjUixTQUFkLENBQUQsSUFBMkIsQ0FBQ04sWUFBL0IsRUFBNEM7QUFBQ0osWUFBTSxHQUFDLGNBQVA7QUFBdUIsS0E5QnFHLENBOEJyRztBQUNwRTs7O0FBQ0EsUUFBSXpVLFVBQVUsR0FBQ2hFLEVBQWYsQ0FoQ3lLLENBZ0N2SjtBQUNsQjtBQUNBOztBQUNBeVAsWUFBUSxHQUFDQSxRQUFRLEdBQUMsQ0FBQyxHQUFFaUIsdUJBQXVCLENBQUM5Syx1QkFBM0IsRUFBb0Q0SyxXQUFXLENBQUNmLFFBQUQsQ0FBL0QsQ0FBRCxHQUE0RUEsUUFBN0Y7O0FBQXNHLFFBQUdpSixpQkFBaUIsSUFBRWpKLFFBQVEsS0FBRyxTQUFqQyxFQUEyQztBQUFDO0FBQUNwTyxhQUFPLENBQUN1WCxrQkFBUixHQUEyQixJQUEzQjs7QUFBZ0MsVUFBR3ZnQixLQUFILEVBQXVELEVBQXZELE1BRXREO0FBQUNraEIsY0FBTSxDQUFDOUosUUFBUCxHQUFnQitFLG1CQUFtQixDQUFDL0UsUUFBRCxFQUFVZ0YsS0FBVixDQUFuQzs7QUFBb0QsWUFBRzhFLE1BQU0sQ0FBQzlKLFFBQVAsS0FBa0JBLFFBQXJCLEVBQThCO0FBQUNBLGtCQUFRLEdBQUM4SixNQUFNLENBQUM5SixRQUFoQjtBQUF5QjhKLGdCQUFNLENBQUM5SixRQUFQLEdBQWdCbEssV0FBVyxDQUFDa0ssUUFBRCxDQUEzQjtBQUFzQ3VDLGFBQUcsR0FBQyxDQUFDLEdBQUVqQixNQUFNLENBQUMyQyxvQkFBVixFQUFnQzZGLE1BQWhDLENBQUo7QUFBNkM7QUFBQztBQUFDOztBQUFBLFVBQU0zUCxLQUFLLEdBQUMsQ0FBQyxHQUFFOEcsdUJBQXVCLENBQUM5Syx1QkFBM0IsRUFBb0Q2SixRQUFwRCxDQUFaOztBQUEwRSxRQUFHLENBQUNuTyxVQUFVLENBQUN0QixFQUFELENBQWQsRUFBbUI7QUFBQyxnQkFBdUM7QUFBQyxjQUFNLElBQUloRixLQUFKLENBQVcsa0JBQWlCZ1gsR0FBSSxjQUFhaFMsRUFBRywyQ0FBdEMsR0FBa0Ysb0ZBQTVGLENBQU47QUFBd0w7O0FBQUE2SCxZQUFNLENBQUN1USxRQUFQLENBQWdCblksSUFBaEIsR0FBcUJELEVBQXJCO0FBQXdCLGFBQU8sS0FBUDtBQUFjOztBQUFBZ0UsY0FBVSxHQUFDc00sU0FBUyxDQUFDRSxXQUFXLENBQUN4TSxVQUFELENBQVosRUFBeUIsS0FBS3hDLE1BQTlCLENBQXBCOztBQUEwRCxRQUFHLENBQUMsR0FBRXdQLFVBQVUsQ0FBQzhDLGNBQWQsRUFBOEJsSyxLQUE5QixDQUFILEVBQXdDO0FBQUMsWUFBTWdRLFFBQVEsR0FBQyxDQUFDLEdBQUUzSSxpQkFBaUIsQ0FBQ3lHLGdCQUFyQixFQUF1QzFULFVBQXZDLENBQWY7QUFBa0UsWUFBTXFPLFVBQVUsR0FBQ3VILFFBQVEsQ0FBQ25LLFFBQTFCO0FBQW1DLFlBQU1vSyxVQUFVLEdBQUMsQ0FBQyxHQUFFeEksV0FBVyxDQUFDb0IsYUFBZixFQUE4QjdJLEtBQTlCLENBQWpCO0FBQXNELFlBQU1rUSxVQUFVLEdBQUMsQ0FBQyxHQUFFMUksYUFBYSxDQUFDeUIsZUFBakIsRUFBa0NnSCxVQUFsQyxFQUE4Q3hILFVBQTlDLENBQWpCO0FBQTJFLFlBQU0wSCxpQkFBaUIsR0FBQ25RLEtBQUssS0FBR3lJLFVBQWhDO0FBQTJDLFlBQU13QixjQUFjLEdBQUNrRyxpQkFBaUIsR0FBQ3RKLGFBQWEsQ0FBQzdHLEtBQUQsRUFBT3lJLFVBQVAsRUFBa0JDLEtBQWxCLENBQWQsR0FBdUMsRUFBN0U7O0FBQWdGLFVBQUcsQ0FBQ3dILFVBQUQsSUFBYUMsaUJBQWlCLElBQUUsQ0FBQ2xHLGNBQWMsQ0FBQ1QsTUFBbkQsRUFBMEQ7QUFBQyxjQUFNNEcsYUFBYSxHQUFDdmEsTUFBTSxDQUFDMEQsSUFBUCxDQUFZMFcsVUFBVSxDQUFDbEgsTUFBdkIsRUFBK0JqWixNQUEvQixDQUFzQ3FaLEtBQUssSUFBRSxDQUFDVCxLQUFLLENBQUNTLEtBQUQsQ0FBbkQsQ0FBcEI7O0FBQWdGLFlBQUdpSCxhQUFhLENBQUMzZ0IsTUFBZCxHQUFxQixDQUF4QixFQUEwQjtBQUFDLG9CQUF1QztBQUFDZ0UsbUJBQU8sQ0FBQ0MsSUFBUixDQUFjLEdBQUV5YyxpQkFBaUIsR0FBRSxvQkFBRixHQUF1QixpQ0FBaUMsOEJBQTVFLEdBQTJHLGVBQWNDLGFBQWEsQ0FBQ3hmLElBQWQsQ0FBbUIsSUFBbkIsQ0FBeUIsOEJBQS9KO0FBQStMOztBQUFBLGdCQUFNLElBQUlRLEtBQUosQ0FBVSxDQUFDK2UsaUJBQWlCLEdBQUUsMEJBQXlCL0gsR0FBSSxvQ0FBbUNnSSxhQUFhLENBQUN4ZixJQUFkLENBQW1CLElBQW5CLENBQXlCLGlDQUEzRixHQUE2SCw4QkFBNkI2WCxVQUFXLDhDQUE2Q3pJLEtBQU0sS0FBMU8sSUFBaVAsK0NBQThDbVEsaUJBQWlCLEdBQUMsMkJBQUQsR0FBNkIsc0JBQXVCLEVBQTlXLENBQU47QUFBd1g7QUFBQyxPQUF0d0IsTUFBMndCLElBQUdBLGlCQUFILEVBQXFCO0FBQUMvWixVQUFFLEdBQUMsQ0FBQyxHQUFFK1EsTUFBTSxDQUFDMkMsb0JBQVYsRUFBZ0NqVSxNQUFNLENBQUNDLE1BQVAsQ0FBYyxFQUFkLEVBQWlCa2EsUUFBakIsRUFBMEI7QUFBQ25LLGtCQUFRLEVBQUNvRSxjQUFjLENBQUNULE1BQXpCO0FBQWdDZCxlQUFLLEVBQUNlLGtCQUFrQixDQUFDZixLQUFELEVBQU91QixjQUFjLENBQUN2VCxNQUF0QjtBQUF4RCxTQUExQixDQUFoQyxDQUFIO0FBQXVKLE9BQTdLLE1BQWlMO0FBQUM7QUFDcGlFYixjQUFNLENBQUNDLE1BQVAsQ0FBYzRTLEtBQWQsRUFBb0J3SCxVQUFwQjtBQUFpQztBQUFDOztBQUFBcEUsVUFBTSxDQUFDaEosTUFBUCxDQUFjMEQsSUFBZCxDQUFtQixrQkFBbkIsRUFBc0NwUSxFQUF0QyxFQUF5Q2laLFVBQXpDOztBQUFxRCxRQUFHO0FBQUMsVUFBSWdCLHFCQUFKLEVBQTBCQyxzQkFBMUIsRUFBaURDLGVBQWpEOztBQUFpRSxVQUFJQyxTQUFTLEdBQUMsTUFBTSxLQUFLQyxZQUFMLENBQWtCelEsS0FBbEIsRUFBd0I2RixRQUF4QixFQUFpQzZDLEtBQWpDLEVBQXVDdFMsRUFBdkMsRUFBMENnRSxVQUExQyxFQUFxRGlWLFVBQXJELENBQXBCO0FBQXFGLFVBQUc7QUFBQ3JZLGFBQUQ7QUFBT2dDLGFBQVA7QUFBYWlWLGVBQWI7QUFBcUJDO0FBQXJCLFVBQThCc0MsU0FBakMsQ0FBdkosQ0FBa007O0FBQzVSLFVBQUcsQ0FBQ3ZDLE9BQU8sSUFBRUMsT0FBVixLQUFvQmxWLEtBQXZCLEVBQTZCO0FBQUMsWUFBR0EsS0FBSyxDQUFDMFgsU0FBTixJQUFpQjFYLEtBQUssQ0FBQzBYLFNBQU4sQ0FBZ0JDLFlBQXBDLEVBQWlEO0FBQUMsZ0JBQU1DLFdBQVcsR0FBQzVYLEtBQUssQ0FBQzBYLFNBQU4sQ0FBZ0JDLFlBQWxDLENBQUQsQ0FBZ0Q7QUFDL0g7QUFDQTs7QUFDQSxjQUFHQyxXQUFXLENBQUNsZixVQUFaLENBQXVCLEdBQXZCLENBQUgsRUFBK0I7QUFBQyxrQkFBTW1mLFVBQVUsR0FBQyxDQUFDLEdBQUV4SixpQkFBaUIsQ0FBQ3lHLGdCQUFyQixFQUF1QzhDLFdBQXZDLENBQWpCO0FBQXFFQyxzQkFBVSxDQUFDaEwsUUFBWCxHQUFvQitFLG1CQUFtQixDQUFDaUcsVUFBVSxDQUFDaEwsUUFBWixFQUFxQmdGLEtBQXJCLENBQXZDO0FBQW1FLGtCQUFLO0FBQUN6QyxpQkFBRyxFQUFDMEksTUFBTDtBQUFZMWEsZ0JBQUUsRUFBQzJhO0FBQWYsZ0JBQXNCeEcsWUFBWSxDQUFDLElBQUQsRUFBTXFHLFdBQU4sRUFBa0JBLFdBQWxCLENBQXZDO0FBQXNFLG1CQUFPLEtBQUs3QyxNQUFMLENBQVljLE1BQVosRUFBbUJpQyxNQUFuQixFQUEwQkMsS0FBMUIsRUFBZ0N0WixPQUFoQyxDQUFQO0FBQWlEOztBQUFBd0csZ0JBQU0sQ0FBQ3VRLFFBQVAsQ0FBZ0JuWSxJQUFoQixHQUFxQnVhLFdBQXJCO0FBQWlDLGlCQUFPLElBQUloZixPQUFKLENBQVksTUFBSSxDQUFFLENBQWxCLENBQVA7QUFBNEI7O0FBQUEsYUFBSzhhLFNBQUwsR0FBZSxDQUFDLENBQUMxVCxLQUFLLENBQUNnWSxXQUF2QixDQUgvVCxDQUdrVzs7QUFDL1gsWUFBR2hZLEtBQUssQ0FBQzBTLFFBQU4sS0FBaUJQLGtCQUFwQixFQUF1QztBQUFDLGNBQUk4RixhQUFKOztBQUFrQixjQUFHO0FBQUMsa0JBQU0sS0FBS0MsY0FBTCxDQUFvQixNQUFwQixDQUFOO0FBQWtDRCx5QkFBYSxHQUFDLE1BQWQ7QUFBc0IsV0FBNUQsQ0FBNEQsT0FBTXhYLENBQU4sRUFBUTtBQUFDd1gseUJBQWEsR0FBQyxTQUFkO0FBQXlCOztBQUFBVCxtQkFBUyxHQUFDLE1BQU0sS0FBS0MsWUFBTCxDQUFrQlEsYUFBbEIsRUFBZ0NBLGFBQWhDLEVBQThDdkksS0FBOUMsRUFBb0R0UyxFQUFwRCxFQUF1RGdFLFVBQXZELEVBQWtFO0FBQUMxQixtQkFBTyxFQUFDO0FBQVQsV0FBbEUsQ0FBaEI7QUFBb0c7QUFBQzs7QUFBQW9ULFlBQU0sQ0FBQ2hKLE1BQVAsQ0FBYzBELElBQWQsQ0FBbUIscUJBQW5CLEVBQXlDcFEsRUFBekMsRUFBNENpWixVQUE1QztBQUF3RCxXQUFLNUIsV0FBTCxDQUFpQm9CLE1BQWpCLEVBQXdCekcsR0FBeEIsRUFBNEJoUyxFQUE1QixFQUErQnFCLE9BQS9COztBQUF3QyxnQkFBdUM7QUFBQyxjQUFNMFosT0FBTyxHQUFDLEtBQUt4RSxVQUFMLENBQWdCLE9BQWhCLEVBQXlCSixTQUF2QztBQUFpRHRPLGNBQU0sQ0FBQ21ULElBQVAsQ0FBWUMsYUFBWixHQUEwQkYsT0FBTyxDQUFDM0wsZUFBUixLQUEwQjJMLE9BQU8sQ0FBQzFMLG1CQUFsQyxJQUF1RCxDQUFDK0ssU0FBUyxDQUFDakUsU0FBVixDQUFvQi9HLGVBQXRHO0FBQXVIOztBQUFBLFVBQUcvTixPQUFPLENBQUNzWCxFQUFSLElBQVlsSixRQUFRLEtBQUcsU0FBdkIsSUFBa0MsQ0FBQyxDQUFDd0sscUJBQXFCLEdBQUNqVSxJQUFJLENBQUNnUyxhQUFMLENBQW1CcFYsS0FBMUMsS0FBa0QsSUFBbEQsR0FBdUQsS0FBSyxDQUE1RCxHQUE4RCxDQUFDc1gsc0JBQXNCLEdBQUNELHFCQUFxQixDQUFDSyxTQUE5QyxLQUEwRCxJQUExRCxHQUErRCxLQUFLLENBQXBFLEdBQXNFSixzQkFBc0IsQ0FBQ2dCLFVBQTVKLE1BQTBLLEdBQTVNLElBQWlOdFksS0FBSyxJQUFFLElBQXhOLElBQThOQSxLQUFLLENBQUMwWCxTQUF2TyxFQUFpUDtBQUFDO0FBQy94QjtBQUNBMVgsYUFBSyxDQUFDMFgsU0FBTixDQUFnQlksVUFBaEIsR0FBMkIsR0FBM0I7QUFBZ0MsT0FQMEQsQ0FPMUQ7OztBQUNoQyxZQUFNQyxtQkFBbUIsR0FBQzlaLE9BQU8sQ0FBQ2lCLE9BQVIsSUFBaUIsS0FBS3NILEtBQUwsS0FBYUEsS0FBeEQ7QUFBOEQsWUFBTXdSLFlBQVksR0FBQyxDQUFDakIsZUFBZSxHQUFDOVksT0FBTyxDQUFDa0IsTUFBekIsS0FBa0MsSUFBbEMsR0FBdUM0WCxlQUF2QyxHQUF1RCxDQUFDZ0IsbUJBQTNFO0FBQStGLFlBQU1FLFdBQVcsR0FBQ0QsWUFBWSxHQUFDO0FBQUMxZ0IsU0FBQyxFQUFDLENBQUg7QUFBSzRnQixTQUFDLEVBQUM7QUFBUCxPQUFELEdBQVcsSUFBekM7QUFBOEMsWUFBTSxLQUFLOVQsR0FBTCxDQUFTb0MsS0FBVCxFQUFlNkYsUUFBZixFQUF3QjZDLEtBQXhCLEVBQThCNkcsU0FBOUIsRUFBd0NpQixTQUF4QyxFQUFrRDVDLFlBQVksSUFBRSxJQUFkLEdBQW1CQSxZQUFuQixHQUFnQzZELFdBQWxGLEVBQStGM2YsS0FBL0YsQ0FBcUcwRyxDQUFDLElBQUU7QUFBQyxZQUFHQSxDQUFDLENBQUNpSCxTQUFMLEVBQWV6SSxLQUFLLEdBQUNBLEtBQUssSUFBRXdCLENBQWIsQ0FBZixLQUFtQyxNQUFNQSxDQUFOO0FBQVMsT0FBckosQ0FBTjs7QUFBNkosVUFBR3hCLEtBQUgsRUFBUztBQUFDOFUsY0FBTSxDQUFDaEosTUFBUCxDQUFjMEQsSUFBZCxDQUFtQixrQkFBbkIsRUFBc0N4UCxLQUF0QyxFQUE0Q3VZLFNBQTVDLEVBQXNERixVQUF0RDtBQUFrRSxjQUFNclksS0FBTjtBQUFhOztBQUFBLFVBQUd2SSxLQUFILEVBQW1DLEVBQTZEOztBQUFBcWQsWUFBTSxDQUFDaEosTUFBUCxDQUFjMEQsSUFBZCxDQUFtQixxQkFBbkIsRUFBeUNwUSxFQUF6QyxFQUE0Q2laLFVBQTVDO0FBQXdELGFBQU8sSUFBUDtBQUFhLEtBUi9nQixDQVErZ0IsT0FBTXRZLEdBQU4sRUFBVTtBQUFDLFVBQUdBLEdBQUcsQ0FBQzBJLFNBQVAsRUFBaUI7QUFBQyxlQUFPLEtBQVA7QUFBYzs7QUFBQSxZQUFNMUksR0FBTjtBQUFXO0FBQUM7O0FBQUEwVyxhQUFXLENBQUNvQixNQUFELEVBQVF6RyxHQUFSLEVBQVloUyxFQUFaLEVBQWVxQixPQUFPLEdBQUMsRUFBdkIsRUFBMEI7QUFBQyxjQUF1QztBQUFDLFVBQUcsT0FBT3dHLE1BQU0sQ0FBQzJRLE9BQWQsS0FBd0IsV0FBM0IsRUFBdUM7QUFBQ25iLGVBQU8sQ0FBQ3VELEtBQVIsQ0FBZSwyQ0FBZjtBQUEyRDtBQUFROztBQUFBLFVBQUcsT0FBT2lILE1BQU0sQ0FBQzJRLE9BQVAsQ0FBZUMsTUFBZixDQUFQLEtBQWdDLFdBQW5DLEVBQStDO0FBQUNwYixlQUFPLENBQUN1RCxLQUFSLENBQWUsMkJBQTBCNlgsTUFBTyxtQkFBaEQ7QUFBb0U7QUFBUTtBQUFDOztBQUFBLFFBQUdBLE1BQU0sS0FBRyxXQUFULElBQXNCLENBQUMsR0FBRTFILE1BQU0sQ0FBQ3VHLE1BQVYsUUFBc0J0WCxFQUEvQyxFQUFrRDtBQUFDLFdBQUtnWCxRQUFMLEdBQWMzVixPQUFPLENBQUNpQixPQUF0QjtBQUE4QnVGLFlBQU0sQ0FBQzJRLE9BQVAsQ0FBZUMsTUFBZixFQUF1QjtBQUFDekcsV0FBRDtBQUFLaFMsVUFBTDtBQUFRcUIsZUFBUjtBQUFnQmtXLFdBQUcsRUFBQyxJQUFwQjtBQUF5QkUsV0FBRyxFQUFDLEtBQUtQLElBQUwsR0FBVXVCLE1BQU0sS0FBRyxXQUFULEdBQXFCLEtBQUt2QixJQUExQixHQUErQixLQUFLQSxJQUFMLEdBQVU7QUFBaEYsT0FBdkIsRUFBMEc7QUFDOW9DO0FBQ0E7QUFDQSxRQUhvaUMsRUFHamlDbFgsRUFIaWlDO0FBRzVoQztBQUFDOztBQUFBLFFBQU11YixvQkFBTixDQUEyQjVhLEdBQTNCLEVBQStCOE8sUUFBL0IsRUFBd0M2QyxLQUF4QyxFQUE4Q3RTLEVBQTlDLEVBQWlEaVosVUFBakQsRUFBNER1QyxhQUE1RCxFQUEwRTtBQUFDLFFBQUc3YSxHQUFHLENBQUMwSSxTQUFQLEVBQWlCO0FBQUM7QUFDdEcsWUFBTTFJLEdBQU47QUFBVzs7QUFBQSxRQUFHLENBQUMsR0FBRWdRLFlBQVksQ0FBQzlKLFlBQWhCLEVBQThCbEcsR0FBOUIsS0FBb0M2YSxhQUF2QyxFQUFxRDtBQUFDOUYsWUFBTSxDQUFDaEosTUFBUCxDQUFjMEQsSUFBZCxDQUFtQixrQkFBbkIsRUFBc0N6UCxHQUF0QyxFQUEwQ1gsRUFBMUMsRUFBNkNpWixVQUE3QyxFQUFELENBQTBEO0FBQzFIO0FBQ0E7QUFDQTtBQUNBOztBQUNBcFIsWUFBTSxDQUFDdVEsUUFBUCxDQUFnQm5ZLElBQWhCLEdBQXFCRCxFQUFyQixDQUxnRSxDQUt4QztBQUN4Qjs7QUFDQSxZQUFNMFIsc0JBQXNCLEVBQTVCO0FBQWdDOztBQUFBLFFBQUc7QUFBQyxVQUFJeUUsU0FBSjtBQUFjLFVBQUk3TCxXQUFKO0FBQWdCLFVBQUkxSCxLQUFKOztBQUFVLFVBQUcsT0FBT3VULFNBQVAsS0FBbUIsV0FBbkIsSUFBZ0MsT0FBTzdMLFdBQVAsS0FBcUIsV0FBeEQsRUFBb0U7QUFBQztBQUFDLFNBQUM7QUFBQ3NLLGNBQUksRUFBQ3VCLFNBQU47QUFBZ0I3TDtBQUFoQixZQUE2QixNQUFNLEtBQUt3USxjQUFMLENBQW9CLFNBQXBCLENBQXBDO0FBQXFFOztBQUFBLFlBQU1WLFNBQVMsR0FBQztBQUFDeFgsYUFBRDtBQUFPdVQsaUJBQVA7QUFBaUI3TCxtQkFBakI7QUFBNkIzSixXQUE3QjtBQUFpQ0MsYUFBSyxFQUFDRDtBQUF2QyxPQUFoQjs7QUFBNEQsVUFBRyxDQUFDeVosU0FBUyxDQUFDeFgsS0FBZCxFQUFvQjtBQUFDLFlBQUc7QUFBQ3dYLG1CQUFTLENBQUN4WCxLQUFWLEdBQWdCLE1BQU0sS0FBS3dNLGVBQUwsQ0FBcUIrRyxTQUFyQixFQUErQjtBQUFDeFYsZUFBRDtBQUFLOE8sb0JBQUw7QUFBYzZDO0FBQWQsV0FBL0IsQ0FBdEI7QUFBNEUsU0FBaEYsQ0FBZ0YsT0FBTW1KLE1BQU4sRUFBYTtBQUFDcGUsaUJBQU8sQ0FBQ3VELEtBQVIsQ0FBYyx5Q0FBZCxFQUF3RDZhLE1BQXhEO0FBQWdFckIsbUJBQVMsQ0FBQ3hYLEtBQVYsR0FBZ0IsRUFBaEI7QUFBb0I7QUFBQzs7QUFBQSxhQUFPd1gsU0FBUDtBQUFrQixLQUE3YyxDQUE2YyxPQUFNc0IsWUFBTixFQUFtQjtBQUFDLGFBQU8sS0FBS0gsb0JBQUwsQ0FBMEJHLFlBQTFCLEVBQXVDak0sUUFBdkMsRUFBZ0Q2QyxLQUFoRCxFQUFzRHRTLEVBQXRELEVBQXlEaVosVUFBekQsRUFBb0UsSUFBcEUsQ0FBUDtBQUFrRjtBQUFDOztBQUFBLFFBQU1vQixZQUFOLENBQW1CelEsS0FBbkIsRUFBeUI2RixRQUF6QixFQUFrQzZDLEtBQWxDLEVBQXdDdFMsRUFBeEMsRUFBMkNnRSxVQUEzQyxFQUFzRGlWLFVBQXRELEVBQWlFO0FBQUMsUUFBRztBQUFDLFlBQU0wQyxpQkFBaUIsR0FBQyxLQUFLcEYsVUFBTCxDQUFnQjNNLEtBQWhCLENBQXhCOztBQUErQyxVQUFHcVAsVUFBVSxDQUFDM1csT0FBWCxJQUFvQnFaLGlCQUFwQixJQUF1QyxLQUFLL1IsS0FBTCxLQUFhQSxLQUF2RCxFQUE2RDtBQUFDLGVBQU8rUixpQkFBUDtBQUEwQjs7QUFBQSxZQUFNQyxlQUFlLEdBQUNELGlCQUFpQixJQUFFLGFBQVlBLGlCQUEvQixHQUFpRDdrQixTQUFqRCxHQUEyRDZrQixpQkFBakY7QUFBbUcsWUFBTXZCLFNBQVMsR0FBQ3dCLGVBQWUsR0FBQ0EsZUFBRCxHQUFpQixNQUFNLEtBQUtkLGNBQUwsQ0FBb0JsUixLQUFwQixFQUEyQmpPLElBQTNCLENBQWdDME0sR0FBRyxLQUFHO0FBQUM4TixpQkFBUyxFQUFDOU4sR0FBRyxDQUFDdU0sSUFBZjtBQUFvQnRLLG1CQUFXLEVBQUNqQyxHQUFHLENBQUNpQyxXQUFwQztBQUFnRHVOLGVBQU8sRUFBQ3hQLEdBQUcsQ0FBQ3dULEdBQUosQ0FBUWhFLE9BQWhFO0FBQXdFQyxlQUFPLEVBQUN6UCxHQUFHLENBQUN3VCxHQUFKLENBQVEvRDtBQUF4RixPQUFILENBQW5DLENBQXREO0FBQStMLFlBQUs7QUFBQzNCLGlCQUFEO0FBQVcwQixlQUFYO0FBQW1CQztBQUFuQixVQUE0QnNDLFNBQWpDOztBQUEyQyxnQkFBdUM7QUFBQyxjQUFLO0FBQUMwQjtBQUFELFlBQXFCN2xCLG1CQUFPLENBQUMsMEJBQUQsQ0FBakM7O0FBQThDLFlBQUcsQ0FBQzZsQixrQkFBa0IsQ0FBQzNGLFNBQUQsQ0FBdEIsRUFBa0M7QUFBQyxnQkFBTSxJQUFJbmIsS0FBSixDQUFXLHlEQUF3RHlVLFFBQVMsR0FBNUUsQ0FBTjtBQUF1RjtBQUFDOztBQUFBLFVBQUkrRixRQUFKOztBQUFhLFVBQUdxQyxPQUFPLElBQUVDLE9BQVosRUFBb0I7QUFBQ3RDLGdCQUFRLEdBQUMsS0FBS1EsVUFBTCxDQUFnQitGLFdBQWhCLENBQTRCLENBQUMsR0FBRWhMLE1BQU0sQ0FBQzJDLG9CQUFWLEVBQWdDO0FBQUNqRSxrQkFBRDtBQUFVNkM7QUFBVixTQUFoQyxDQUE1QixFQUE4RXRPLFVBQTlFLEVBQXlGNlQsT0FBekYsRUFBaUcsS0FBS3JXLE1BQXRHLENBQVQ7QUFBd0g7O0FBQUEsWUFBTW9CLEtBQUssR0FBQyxNQUFNLEtBQUtvWixRQUFMLENBQWMsTUFBSW5FLE9BQU8sR0FBQyxLQUFLb0UsY0FBTCxDQUFvQnpHLFFBQXBCLENBQUQsR0FBK0JzQyxPQUFPLEdBQUMsS0FBS29FLGNBQUwsQ0FBb0IxRyxRQUFwQixDQUFELEdBQStCLEtBQUtwRyxlQUFMLENBQXFCK0csU0FBckIsRUFBK0I7QUFDeG1EO0FBQUMxRyxnQkFBRDtBQUFVNkMsYUFBVjtBQUFnQnFCLGNBQU0sRUFBQzNULEVBQXZCO0FBQTBCd0IsY0FBTSxFQUFDLEtBQUtBLE1BQXRDO0FBQTZDNkQsZUFBTyxFQUFDLEtBQUtBLE9BQTFEO0FBQWtFSSxxQkFBYSxFQUFDLEtBQUtBO0FBQXJGLE9BRHlrRCxDQUE5RixDQUFsQjtBQUNuM0MyVSxlQUFTLENBQUN4WCxLQUFWLEdBQWdCQSxLQUFoQjtBQUFzQixXQUFLMlQsVUFBTCxDQUFnQjNNLEtBQWhCLElBQXVCd1EsU0FBdkI7QUFBaUMsYUFBT0EsU0FBUDtBQUFrQixLQUR1ZSxDQUN2ZSxPQUFNelosR0FBTixFQUFVO0FBQUMsYUFBTyxLQUFLNGEsb0JBQUwsQ0FBMEI1YSxHQUExQixFQUE4QjhPLFFBQTlCLEVBQXVDNkMsS0FBdkMsRUFBNkN0UyxFQUE3QyxFQUFnRGlaLFVBQWhELENBQVA7QUFBb0U7QUFBQzs7QUFBQXpSLEtBQUcsQ0FBQ29DLEtBQUQsRUFBTzZGLFFBQVAsRUFBZ0I2QyxLQUFoQixFQUFzQnRTLEVBQXRCLEVBQXlCcVYsSUFBekIsRUFBOEJnRyxXQUE5QixFQUEwQztBQUFDLFNBQUtoRixVQUFMLEdBQWdCLEtBQWhCO0FBQXNCLFNBQUt6TSxLQUFMLEdBQVdBLEtBQVg7QUFBaUIsU0FBSzZGLFFBQUwsR0FBY0EsUUFBZDtBQUF1QixTQUFLNkMsS0FBTCxHQUFXQSxLQUFYO0FBQWlCLFNBQUtxQixNQUFMLEdBQVkzVCxFQUFaO0FBQWUsV0FBTyxLQUFLc1osTUFBTCxDQUFZakUsSUFBWixFQUFpQmdHLFdBQWpCLENBQVA7QUFBc0M7QUFBQTtBQUNqYjtBQUNBO0FBQ0E7OztBQUFLYyxnQkFBYyxDQUFDbFcsRUFBRCxFQUFJO0FBQUMsU0FBSzJRLElBQUwsR0FBVTNRLEVBQVY7QUFBYzs7QUFBQW1ULGlCQUFlLENBQUNwWixFQUFELEVBQUk7QUFBQyxRQUFHLENBQUMsS0FBSzJULE1BQVQsRUFBZ0IsT0FBTyxLQUFQO0FBQWEsVUFBSyxDQUFDeUksWUFBRCxFQUFjQyxPQUFkLElBQXVCLEtBQUsxSSxNQUFMLENBQVkvRCxLQUFaLENBQWtCLEdBQWxCLENBQTVCO0FBQW1ELFVBQUssQ0FBQzBNLFlBQUQsRUFBY0MsT0FBZCxJQUF1QnZjLEVBQUUsQ0FBQzRQLEtBQUgsQ0FBUyxHQUFULENBQTVCLENBQWpGLENBQTJIOztBQUNwTCxRQUFHMk0sT0FBTyxJQUFFSCxZQUFZLEtBQUdFLFlBQXhCLElBQXNDRCxPQUFPLEtBQUdFLE9BQW5ELEVBQTJEO0FBQUMsYUFBTyxJQUFQO0FBQWEsS0FEaEIsQ0FDZ0I7OztBQUN6RSxRQUFHSCxZQUFZLEtBQUdFLFlBQWxCLEVBQStCO0FBQUMsYUFBTyxLQUFQO0FBQWMsS0FGVyxDQUVYO0FBQzlDO0FBQ0E7QUFDQTs7O0FBQ0EsV0FBT0QsT0FBTyxLQUFHRSxPQUFqQjtBQUEwQjs7QUFBQWxELGNBQVksQ0FBQ3JaLEVBQUQsRUFBSTtBQUFDLFVBQUssR0FBRWlVLElBQUYsSUFBUWpVLEVBQUUsQ0FBQzRQLEtBQUgsQ0FBUyxHQUFULENBQWIsQ0FBRCxDQUE0QjtBQUN0RTs7QUFDQSxRQUFHcUUsSUFBSSxLQUFHLEVBQVAsSUFBV0EsSUFBSSxLQUFHLEtBQXJCLEVBQTJCO0FBQUNwTSxZQUFNLENBQUMyVSxRQUFQLENBQWdCLENBQWhCLEVBQWtCLENBQWxCO0FBQXFCO0FBQVEsS0FGZixDQUVlOzs7QUFDekQsVUFBTUMsSUFBSSxHQUFDN1UsUUFBUSxDQUFDOFUsY0FBVCxDQUF3QnpJLElBQXhCLENBQVg7O0FBQXlDLFFBQUd3SSxJQUFILEVBQVE7QUFBQ0EsVUFBSSxDQUFDRSxjQUFMO0FBQXNCO0FBQVEsS0FIdEMsQ0FHc0M7QUFDaEY7OztBQUNBLFVBQU1DLE1BQU0sR0FBQ2hWLFFBQVEsQ0FBQ2lWLGlCQUFULENBQTJCNUksSUFBM0IsRUFBaUMsQ0FBakMsQ0FBYjs7QUFBaUQsUUFBRzJJLE1BQUgsRUFBVTtBQUFDQSxZQUFNLENBQUNELGNBQVA7QUFBeUI7QUFBQzs7QUFBQWhELFVBQVEsQ0FBQ2hHLE1BQUQsRUFBUTtBQUFDLFdBQU8sS0FBS0EsTUFBTCxLQUFjQSxNQUFyQjtBQUE2QjtBQUFBO0FBQ3BJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUFLLFFBQU14UyxRQUFOLENBQWU2USxHQUFmLEVBQW1CMkIsTUFBTSxHQUFDM0IsR0FBMUIsRUFBOEIzUSxPQUFPLEdBQUMsRUFBdEMsRUFBeUM7QUFBQyxRQUFJa1ksTUFBTSxHQUFDLENBQUMsR0FBRXRJLGlCQUFpQixDQUFDeUcsZ0JBQXJCLEVBQXVDMUYsR0FBdkMsQ0FBWDtBQUF1RCxRQUFHO0FBQUN2QztBQUFELFFBQVc4SixNQUFkOztBQUFxQixRQUFHbGhCLEtBQUgsRUFBbUMsRUFBeWY7O0FBQUEsVUFBTW9jLEtBQUssR0FBQyxNQUFNLEtBQUt1QixVQUFMLENBQWdCeUQsV0FBaEIsRUFBbEI7QUFBZ0QsUUFBSXpWLFVBQVUsR0FBQzJQLE1BQWY7O0FBQXNCLFFBQUd0YixLQUFILEVBQTJELEVBQTNELE1BRTdtQjtBQUFDa2hCLFlBQU0sQ0FBQzlKLFFBQVAsR0FBZ0IrRSxtQkFBbUIsQ0FBQytFLE1BQU0sQ0FBQzlKLFFBQVIsRUFBaUJnRixLQUFqQixDQUFuQzs7QUFBMkQsVUFBRzhFLE1BQU0sQ0FBQzlKLFFBQVAsS0FBa0JBLFFBQXJCLEVBQThCO0FBQUNBLGdCQUFRLEdBQUM4SixNQUFNLENBQUM5SixRQUFoQjtBQUF5QjhKLGNBQU0sQ0FBQzlKLFFBQVAsR0FBZ0JBLFFBQWhCO0FBQXlCdUMsV0FBRyxHQUFDLENBQUMsR0FBRWpCLE1BQU0sQ0FBQzJDLG9CQUFWLEVBQWdDNkYsTUFBaEMsQ0FBSjtBQUE2QztBQUFDOztBQUFBLFVBQU0zUCxLQUFLLEdBQUMsQ0FBQyxHQUFFOEcsdUJBQXVCLENBQUM5Syx1QkFBM0IsRUFBb0Q2SixRQUFwRCxDQUFaLENBRjdQLENBRXVVOztBQUNyWCxjQUF1QztBQUFDO0FBQVE7O0FBQUEsVUFBTWpVLE9BQU8sQ0FBQ2lCLEdBQVIsQ0FBWSxDQUFDLEtBQUt1WixVQUFMLENBQWdCOEcsTUFBaEIsQ0FBdUJsVCxLQUF2QixFQUE4QmpPLElBQTlCLENBQW1Db2hCLEtBQUssSUFBRTtBQUFDLGFBQU9BLEtBQUssR0FBQyxLQUFLZCxjQUFMLENBQW9CLEtBQUtqRyxVQUFMLENBQWdCK0YsV0FBaEIsQ0FBNEIvSixHQUE1QixFQUFnQ2hPLFVBQWhDLEVBQTJDLElBQTNDLEVBQWdELE9BQU8zQyxPQUFPLENBQUNHLE1BQWYsS0FBd0IsV0FBeEIsR0FBb0NILE9BQU8sQ0FBQ0csTUFBNUMsR0FBbUQsS0FBS0EsTUFBeEcsQ0FBcEIsQ0FBRCxHQUFzSSxLQUFsSjtBQUF5SixLQUFwTSxDQUFELEVBQXVNLEtBQUt3VSxVQUFMLENBQWdCM1UsT0FBTyxDQUFDbkYsUUFBUixHQUFpQixVQUFqQixHQUE0QixVQUE1QyxFQUF3RDBOLEtBQXhELENBQXZNLENBQVosQ0FBTjtBQUEyUjs7QUFBQSxRQUFNa1IsY0FBTixDQUFxQmxSLEtBQXJCLEVBQTJCO0FBQUMsUUFBSVAsU0FBUyxHQUFDLEtBQWQ7O0FBQW9CLFVBQU0yVCxNQUFNLEdBQUMsS0FBS3JHLEdBQUwsR0FBUyxNQUFJO0FBQUN0TixlQUFTLEdBQUMsSUFBVjtBQUFnQixLQUEzQzs7QUFBNEMsVUFBTTRULGVBQWUsR0FBQyxNQUFNLEtBQUtqSCxVQUFMLENBQWdCa0gsUUFBaEIsQ0FBeUJ0VCxLQUF6QixDQUE1Qjs7QUFBNEQsUUFBR1AsU0FBSCxFQUFhO0FBQUMsWUFBTXpJLEtBQUssR0FBQyxJQUFJNUYsS0FBSixDQUFXLHdDQUF1QzRPLEtBQU0sR0FBeEQsQ0FBWjtBQUF3RWhKLFdBQUssQ0FBQ3lJLFNBQU4sR0FBZ0IsSUFBaEI7QUFBcUIsWUFBTXpJLEtBQU47QUFBYTs7QUFBQSxRQUFHb2MsTUFBTSxLQUFHLEtBQUtyRyxHQUFqQixFQUFxQjtBQUFDLFdBQUtBLEdBQUwsR0FBUyxJQUFUO0FBQWU7O0FBQUEsV0FBT3NHLGVBQVA7QUFBd0I7O0FBQUFqQixVQUFRLENBQUMvUSxFQUFELEVBQUk7QUFBQyxRQUFJNUIsU0FBUyxHQUFDLEtBQWQ7O0FBQW9CLFVBQU0yVCxNQUFNLEdBQUMsTUFBSTtBQUFDM1QsZUFBUyxHQUFDLElBQVY7QUFBZ0IsS0FBbEM7O0FBQW1DLFNBQUtzTixHQUFMLEdBQVNxRyxNQUFUO0FBQWdCLFdBQU8vUixFQUFFLEdBQUd0UCxJQUFMLENBQVUwWixJQUFJLElBQUU7QUFBQyxVQUFHMkgsTUFBTSxLQUFHLEtBQUtyRyxHQUFqQixFQUFxQjtBQUFDLGFBQUtBLEdBQUwsR0FBUyxJQUFUO0FBQWU7O0FBQUEsVUFBR3ROLFNBQUgsRUFBYTtBQUFDLGNBQU0xSSxHQUFHLEdBQUMsSUFBSTNGLEtBQUosQ0FBVSxpQ0FBVixDQUFWO0FBQXVEMkYsV0FBRyxDQUFDMEksU0FBSixHQUFjLElBQWQ7QUFBbUIsY0FBTTFJLEdBQU47QUFBVzs7QUFBQSxhQUFPMFUsSUFBUDtBQUFhLEtBQXRLLENBQVA7QUFBZ0w7O0FBQUE0RyxnQkFBYyxDQUFDekcsUUFBRCxFQUFVO0FBQUMsVUFBSztBQUFDdlYsVUFBSSxFQUFDa2Q7QUFBTixRQUFnQixJQUFJemMsR0FBSixDQUFROFUsUUFBUixFQUFpQjNOLE1BQU0sQ0FBQ3VRLFFBQVAsQ0FBZ0JuWSxJQUFqQyxDQUFyQjs7QUFBNEQsUUFBRyxLQUFILEVBQTRFLEVBQTZDOztBQUFBLFdBQU9zVixhQUFhLENBQUNDLFFBQUQsRUFBVSxLQUFLc0IsS0FBZixDQUFiLENBQW1DbmIsSUFBbkMsQ0FBd0MwWixJQUFJLElBQUU7QUFBQyxXQUFLbUIsR0FBTCxDQUFTMkcsUUFBVCxJQUFtQjlILElBQW5CO0FBQXdCLGFBQU9BLElBQVA7QUFBYSxLQUFwRixDQUFQO0FBQThGOztBQUFBNkcsZ0JBQWMsQ0FBQzFHLFFBQUQsRUFBVTtBQUFDLFVBQUs7QUFBQ3ZWLFVBQUksRUFBQ21kO0FBQU4sUUFBbUIsSUFBSTFjLEdBQUosQ0FBUThVLFFBQVIsRUFBaUIzTixNQUFNLENBQUN1USxRQUFQLENBQWdCblksSUFBakMsQ0FBeEI7O0FBQStELFFBQUcsS0FBS3dXLEdBQUwsQ0FBUzJHLFdBQVQsQ0FBSCxFQUF5QjtBQUFDLGFBQU8sS0FBSzNHLEdBQUwsQ0FBUzJHLFdBQVQsQ0FBUDtBQUE4Qjs7QUFBQSxXQUFPLEtBQUszRyxHQUFMLENBQVMyRyxXQUFULElBQXNCN0gsYUFBYSxDQUFDQyxRQUFELEVBQVUsS0FBS3NCLEtBQWYsQ0FBYixDQUFtQ25iLElBQW5DLENBQXdDMFosSUFBSSxJQUFFO0FBQUMsYUFBTyxLQUFLb0IsR0FBTCxDQUFTMkcsV0FBVCxDQUFQO0FBQTZCLGFBQU8vSCxJQUFQO0FBQWEsS0FBekYsRUFBMkYzWixLQUEzRixDQUFpR2lGLEdBQUcsSUFBRTtBQUFDLGFBQU8sS0FBSzhWLEdBQUwsQ0FBUzJHLFdBQVQsQ0FBUDtBQUE2QixZQUFNemMsR0FBTjtBQUFXLEtBQS9JLENBQTdCO0FBQStLOztBQUFBeU8saUJBQWUsQ0FBQytHLFNBQUQsRUFBV2tILEdBQVgsRUFBZTtBQUFDLFVBQUs7QUFBQ2xILGVBQVMsRUFBQ0Y7QUFBWCxRQUFnQixLQUFLTSxVQUFMLENBQWdCLE9BQWhCLENBQXJCOztBQUE4QyxVQUFNK0csT0FBTyxHQUFDLEtBQUt6RyxRQUFMLENBQWNaLEdBQWQsQ0FBZDs7QUFBaUNvSCxPQUFHLENBQUNDLE9BQUosR0FBWUEsT0FBWjtBQUFvQixXQUFNLENBQUMsR0FBRXZNLE1BQU0sQ0FBQ3dNLG1CQUFWLEVBQStCdEgsR0FBL0IsRUFBbUM7QUFBQ3FILGFBQUQ7QUFBU25ILGVBQVQ7QUFBbUIvVSxZQUFNLEVBQUMsSUFBMUI7QUFBK0JpYztBQUEvQixLQUFuQyxDQUFOO0FBQStFOztBQUFBbkUsb0JBQWtCLENBQUNsWixFQUFELEVBQUlpWixVQUFKLEVBQWU7QUFBQyxRQUFHLEtBQUt0QyxHQUFSLEVBQVk7QUFBQ2pCLFlBQU0sQ0FBQ2hKLE1BQVAsQ0FBYzBELElBQWQsQ0FBbUIsa0JBQW5CLEVBQXNDc0Isc0JBQXNCLEVBQTVELEVBQStEMVIsRUFBL0QsRUFBa0VpWixVQUFsRTtBQUE4RSxXQUFLdEMsR0FBTDtBQUFXLFdBQUtBLEdBQUwsR0FBUyxJQUFUO0FBQWU7QUFBQzs7QUFBQTJDLFFBQU0sQ0FBQ2pFLElBQUQsRUFBTWdHLFdBQU4sRUFBa0I7QUFBQyxXQUFPLEtBQUszRSxHQUFMLENBQVNyQixJQUFULEVBQWMsS0FBS2tCLFVBQUwsQ0FBZ0IsT0FBaEIsRUFBeUJKLFNBQXZDLEVBQWlEa0YsV0FBakQsQ0FBUDtBQUFzRTs7QUFuSTMzRDs7QUFtSTQzRG5sQixlQUFBLEdBQWdCd2YsTUFBaEI7QUFBdUJBLE1BQU0sQ0FBQ2hKLE1BQVAsR0FBYyxDQUFDLEdBQUVvRSxLQUFLLENBQUN0WixPQUFULEdBQWQsQzs7Ozs7Ozs7Ozs7QUNoTDE5RDs7QUFBQXRCLGtCQUFBLEdBQW1CLElBQW5CO0FBQXdCQSxpQkFBQSxHQUFrQnNuQixTQUFsQjs7QUFBNEIsSUFBSUMsV0FBVyxHQUFDMWMsdUJBQXVCLENBQUM5SyxtQkFBTyxDQUFDLDJGQUFELENBQVIsQ0FBdkM7O0FBQWtFLFNBQVN5bkIsd0JBQVQsR0FBbUM7QUFBQyxNQUFHLE9BQU9DLE9BQVAsS0FBaUIsVUFBcEIsRUFBK0IsT0FBTyxJQUFQO0FBQVksTUFBSUMsS0FBSyxHQUFDLElBQUlELE9BQUosRUFBVjs7QUFBd0JELDBCQUF3QixHQUFDLFlBQVU7QUFBQyxXQUFPRSxLQUFQO0FBQWMsR0FBbEQ7O0FBQW1ELFNBQU9BLEtBQVA7QUFBYzs7QUFBQSxTQUFTN2MsdUJBQVQsQ0FBaUN1USxHQUFqQyxFQUFxQztBQUFDLE1BQUdBLEdBQUcsSUFBRUEsR0FBRyxDQUFDQyxVQUFaLEVBQXVCO0FBQUMsV0FBT0QsR0FBUDtBQUFZOztBQUFBLE1BQUdBLEdBQUcsS0FBRyxJQUFOLElBQVksT0FBT0EsR0FBUCxLQUFhLFFBQWIsSUFBdUIsT0FBT0EsR0FBUCxLQUFhLFVBQW5ELEVBQThEO0FBQUMsV0FBTTtBQUFDOVosYUFBTyxFQUFDOFo7QUFBVCxLQUFOO0FBQXFCOztBQUFBLE1BQUlzTSxLQUFLLEdBQUNGLHdCQUF3QixFQUFsQzs7QUFBcUMsTUFBR0UsS0FBSyxJQUFFQSxLQUFLLENBQUN0UyxHQUFOLENBQVVnRyxHQUFWLENBQVYsRUFBeUI7QUFBQyxXQUFPc00sS0FBSyxDQUFDOWlCLEdBQU4sQ0FBVXdXLEdBQVYsQ0FBUDtBQUF1Qjs7QUFBQSxNQUFJdU0sTUFBTSxHQUFDLEVBQVg7QUFBYyxNQUFJQyxxQkFBcUIsR0FBQ3JlLE1BQU0sQ0FBQ3FKLGNBQVAsSUFBdUJySixNQUFNLENBQUNzZSx3QkFBeEQ7O0FBQWlGLE9BQUksSUFBSWplLEdBQVIsSUFBZXdSLEdBQWYsRUFBbUI7QUFBQyxRQUFHN1IsTUFBTSxDQUFDdWUsU0FBUCxDQUFpQkMsY0FBakIsQ0FBZ0NDLElBQWhDLENBQXFDNU0sR0FBckMsRUFBeUN4UixHQUF6QyxDQUFILEVBQWlEO0FBQUMsVUFBSXFlLElBQUksR0FBQ0wscUJBQXFCLEdBQUNyZSxNQUFNLENBQUNzZSx3QkFBUCxDQUFnQ3pNLEdBQWhDLEVBQW9DeFIsR0FBcEMsQ0FBRCxHQUEwQyxJQUF4RTs7QUFBNkUsVUFBR3FlLElBQUksS0FBR0EsSUFBSSxDQUFDcmpCLEdBQUwsSUFBVXFqQixJQUFJLENBQUMzVyxHQUFsQixDQUFQLEVBQThCO0FBQUMvSCxjQUFNLENBQUNxSixjQUFQLENBQXNCK1UsTUFBdEIsRUFBNkIvZCxHQUE3QixFQUFpQ3FlLElBQWpDO0FBQXdDLE9BQXZFLE1BQTJFO0FBQUNOLGNBQU0sQ0FBQy9kLEdBQUQsQ0FBTixHQUFZd1IsR0FBRyxDQUFDeFIsR0FBRCxDQUFmO0FBQXNCO0FBQUM7QUFBQzs7QUFBQStkLFFBQU0sQ0FBQ3JtQixPQUFQLEdBQWU4WixHQUFmOztBQUFtQixNQUFHc00sS0FBSCxFQUFTO0FBQUNBLFNBQUssQ0FBQ3BXLEdBQU4sQ0FBVThKLEdBQVYsRUFBY3VNLE1BQWQ7QUFBdUI7O0FBQUEsU0FBT0EsTUFBUDtBQUFlLEMsQ0FBQTtBQUN4N0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsTUFBTU8sZ0JBQWdCLEdBQUMsd0JBQXZCOztBQUFnRCxTQUFTWixTQUFULENBQW1CYSxNQUFuQixFQUEwQjtBQUFDLE1BQUc7QUFBQ0MsUUFBRDtBQUFNemQ7QUFBTixNQUFnQndkLE1BQW5CO0FBQTBCLE1BQUlFLFFBQVEsR0FBQ0YsTUFBTSxDQUFDRSxRQUFQLElBQWlCLEVBQTlCO0FBQWlDLE1BQUk5TyxRQUFRLEdBQUM0TyxNQUFNLENBQUM1TyxRQUFQLElBQWlCLEVBQTlCO0FBQWlDLE1BQUl3RSxJQUFJLEdBQUNvSyxNQUFNLENBQUNwSyxJQUFQLElBQWEsRUFBdEI7QUFBeUIsTUFBSTNCLEtBQUssR0FBQytMLE1BQU0sQ0FBQy9MLEtBQVAsSUFBYyxFQUF4QjtBQUEyQixNQUFJa00sSUFBSSxHQUFDLEtBQVQ7QUFBZUYsTUFBSSxHQUFDQSxJQUFJLEdBQUN4ZCxrQkFBa0IsQ0FBQ3dkLElBQUQsQ0FBbEIsQ0FBeUJqYyxPQUF6QixDQUFpQyxNQUFqQyxFQUF3QyxHQUF4QyxJQUE2QyxHQUE5QyxHQUFrRCxFQUEzRDs7QUFBOEQsTUFBR2djLE1BQU0sQ0FBQ0csSUFBVixFQUFlO0FBQUNBLFFBQUksR0FBQ0YsSUFBSSxHQUFDRCxNQUFNLENBQUNHLElBQWpCO0FBQXVCLEdBQXZDLE1BQTRDLElBQUczZCxRQUFILEVBQVk7QUFBQzJkLFFBQUksR0FBQ0YsSUFBSSxJQUFFLENBQUN6ZCxRQUFRLENBQUM2QixPQUFULENBQWlCLEdBQWpCLENBQUQsR0FBd0IsSUFBRzdCLFFBQVMsR0FBcEMsR0FBdUNBLFFBQXpDLENBQVQ7O0FBQTRELFFBQUd3ZCxNQUFNLENBQUNJLElBQVYsRUFBZTtBQUFDRCxVQUFJLElBQUUsTUFBSUgsTUFBTSxDQUFDSSxJQUFqQjtBQUF1QjtBQUFDOztBQUFBLE1BQUduTSxLQUFLLElBQUUsT0FBT0EsS0FBUCxLQUFlLFFBQXpCLEVBQWtDO0FBQUNBLFNBQUssR0FBQ25WLE1BQU0sQ0FBQ3NnQixXQUFXLENBQUNpQixzQkFBWixDQUFtQ3BNLEtBQW5DLENBQUQsQ0FBWjtBQUF5RDs7QUFBQSxNQUFJK0YsTUFBTSxHQUFDZ0csTUFBTSxDQUFDaEcsTUFBUCxJQUFlL0YsS0FBSyxJQUFHLElBQUdBLEtBQU0sRUFBaEMsSUFBbUMsRUFBOUM7QUFBaUQsTUFBR2lNLFFBQVEsSUFBRUEsUUFBUSxDQUFDSSxNQUFULENBQWdCLENBQUMsQ0FBakIsTUFBc0IsR0FBbkMsRUFBdUNKLFFBQVEsSUFBRSxHQUFWOztBQUFjLE1BQUdGLE1BQU0sQ0FBQ08sT0FBUCxJQUFnQixDQUFDLENBQUNMLFFBQUQsSUFBV0gsZ0JBQWdCLENBQUN2UyxJQUFqQixDQUFzQjBTLFFBQXRCLENBQVosS0FBOENDLElBQUksS0FBRyxLQUF4RSxFQUE4RTtBQUFDQSxRQUFJLEdBQUMsUUFBTUEsSUFBSSxJQUFFLEVBQVosQ0FBTDtBQUFxQixRQUFHL08sUUFBUSxJQUFFQSxRQUFRLENBQUMsQ0FBRCxDQUFSLEtBQWMsR0FBM0IsRUFBK0JBLFFBQVEsR0FBQyxNQUFJQSxRQUFiO0FBQXVCLEdBQTFKLE1BQStKLElBQUcsQ0FBQytPLElBQUosRUFBUztBQUFDQSxRQUFJLEdBQUMsRUFBTDtBQUFTOztBQUFBLE1BQUd2SyxJQUFJLElBQUVBLElBQUksQ0FBQyxDQUFELENBQUosS0FBVSxHQUFuQixFQUF1QkEsSUFBSSxHQUFDLE1BQUlBLElBQVQ7QUFBYyxNQUFHb0UsTUFBTSxJQUFFQSxNQUFNLENBQUMsQ0FBRCxDQUFOLEtBQVksR0FBdkIsRUFBMkJBLE1BQU0sR0FBQyxNQUFJQSxNQUFYO0FBQWtCNUksVUFBUSxHQUFDQSxRQUFRLENBQUNwTixPQUFULENBQWlCLE9BQWpCLEVBQXlCdkIsa0JBQXpCLENBQVQ7QUFBc0R1WCxRQUFNLEdBQUNBLE1BQU0sQ0FBQ2hXLE9BQVAsQ0FBZSxHQUFmLEVBQW1CLEtBQW5CLENBQVA7QUFBaUMsU0FBTyxHQUFFa2MsUUFBUyxHQUFFQyxJQUFLLEdBQUUvTyxRQUFTLEdBQUU0SSxNQUFPLEdBQUVwRSxJQUFLLEVBQXBEO0FBQXVELEM7Ozs7Ozs7Ozs7O0FDckI1Z0M7O0FBQUEvZCxrQkFBQSxHQUFtQixJQUFuQjtBQUF3QkEsc0JBQUEsR0FBdUI0ZCxjQUF2QixDLENBQXNDOztBQUMzRSxNQUFNK0ssVUFBVSxHQUFDLHNCQUFqQjs7QUFBd0MsU0FBUy9LLGNBQVQsQ0FBd0JsSyxLQUF4QixFQUE4QjtBQUFDLFNBQU9pVixVQUFVLENBQUNoVCxJQUFYLENBQWdCakMsS0FBaEIsQ0FBUDtBQUErQixDOzs7Ozs7Ozs7OztBQ0R6Rjs7QUFBQTFULGtCQUFBLEdBQW1CLElBQW5CO0FBQXdCQSx3QkFBQSxHQUF5QndoQixnQkFBekI7O0FBQTBDLElBQUkzRyxNQUFNLEdBQUM5YSxtQkFBTyxDQUFDLHNFQUFELENBQWxCOztBQUFrQyxJQUFJaWIsWUFBWSxHQUFDamIsbUJBQU8sQ0FBQywyRkFBRCxDQUF4QjtBQUEwQztBQUMzSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFBRyxTQUFTeWhCLGdCQUFULENBQTBCMUYsR0FBMUIsRUFBOEJ3QixJQUE5QixFQUFtQztBQUFDLFFBQU1zTCxVQUFVLEdBQUMsSUFBSXBlLEdBQUosQ0FBUSxRQUE0QixVQUE1QixHQUF1QyxDQUEvQyxDQUFqQjtBQUFnRyxRQUFNcWUsWUFBWSxHQUFDdkwsSUFBSSxHQUFDLElBQUk5UyxHQUFKLENBQVE4UyxJQUFSLEVBQWFzTCxVQUFiLENBQUQsR0FBMEJBLFVBQWpEO0FBQTRELFFBQUs7QUFBQ3JQLFlBQUQ7QUFBVXNFLGdCQUFWO0FBQXVCc0UsVUFBdkI7QUFBOEJwRSxRQUE5QjtBQUFtQ2hVLFFBQW5DO0FBQXdDbVM7QUFBeEMsTUFBZ0QsSUFBSTFSLEdBQUosQ0FBUXNSLEdBQVIsRUFBWStNLFlBQVosQ0FBckQ7O0FBQStFLE1BQUczTSxNQUFNLEtBQUcwTSxVQUFVLENBQUMxTSxNQUF2QixFQUE4QjtBQUFDLFVBQU0sSUFBSXBYLEtBQUosQ0FBVyxvREFBbURnWCxHQUFJLEVBQWxFLENBQU47QUFBNEU7O0FBQUEsU0FBTTtBQUFDdkMsWUFBRDtBQUFVNkMsU0FBSyxFQUFDLENBQUMsR0FBRXBCLFlBQVksQ0FBQzhDLHNCQUFoQixFQUF3Q0QsWUFBeEMsQ0FBaEI7QUFBc0VzRSxVQUF0RTtBQUE2RXBFLFFBQTdFO0FBQWtGaFUsUUFBSSxFQUFDQSxJQUFJLENBQUNJLEtBQUwsQ0FBV3llLFVBQVUsQ0FBQzFNLE1BQVgsQ0FBa0IvWSxNQUE3QjtBQUF2RixHQUFOO0FBQW9JLEM7Ozs7Ozs7Ozs7O0FDTHBmOztBQUFBbkQsa0JBQUEsR0FBbUIsSUFBbkI7QUFBd0JBLDhCQUFBLEdBQStCOGQsc0JBQS9CO0FBQXNEOWQsOEJBQUEsR0FBK0J3b0Isc0JBQS9CO0FBQXNEeG9CLGNBQUEsR0FBZXdKLE1BQWY7O0FBQXNCLFNBQVNzVSxzQkFBVCxDQUFnQ0QsWUFBaEMsRUFBNkM7QUFBQyxRQUFNekIsS0FBSyxHQUFDLEVBQVo7QUFBZXlCLGNBQVksQ0FBQzNRLE9BQWIsQ0FBcUIsQ0FBQ3FFLEtBQUQsRUFBTzNILEdBQVAsS0FBYTtBQUFDLFFBQUcsT0FBT3dTLEtBQUssQ0FBQ3hTLEdBQUQsQ0FBWixLQUFvQixXQUF2QixFQUFtQztBQUFDd1MsV0FBSyxDQUFDeFMsR0FBRCxDQUFMLEdBQVcySCxLQUFYO0FBQWtCLEtBQXRELE1BQTJELElBQUdpRyxLQUFLLENBQUNDLE9BQU4sQ0FBYzJFLEtBQUssQ0FBQ3hTLEdBQUQsQ0FBbkIsQ0FBSCxFQUE2QjtBQUFDO0FBQUN3UyxXQUFLLENBQUN4UyxHQUFELENBQUwsQ0FBVzNHLElBQVgsQ0FBZ0JzTyxLQUFoQjtBQUF3QixLQUF2RCxNQUEyRDtBQUFDNkssV0FBSyxDQUFDeFMsR0FBRCxDQUFMLEdBQVcsQ0FBQ3dTLEtBQUssQ0FBQ3hTLEdBQUQsQ0FBTixFQUFZMkgsS0FBWixDQUFYO0FBQStCO0FBQUMsR0FBMUw7QUFBNEwsU0FBTzZLLEtBQVA7QUFBYzs7QUFBQSxTQUFTME0sc0JBQVQsQ0FBZ0NqTSxLQUFoQyxFQUFzQztBQUFDLE1BQUcsT0FBT0EsS0FBUCxLQUFlLFFBQWYsSUFBeUIsT0FBT0EsS0FBUCxLQUFlLFFBQWYsSUFBeUIsQ0FBQzNWLEtBQUssQ0FBQzJWLEtBQUQsQ0FBeEQsSUFBaUUsT0FBT0EsS0FBUCxLQUFlLFNBQW5GLEVBQTZGO0FBQUMsV0FBTzVWLE1BQU0sQ0FBQzRWLEtBQUQsQ0FBYjtBQUFzQixHQUFwSCxNQUF3SDtBQUFDLFdBQU0sRUFBTjtBQUFVO0FBQUM7O0FBQUEsU0FBUzJMLHNCQUFULENBQWdDTyxRQUFoQyxFQUF5QztBQUFDLFFBQU03TCxNQUFNLEdBQUMsSUFBSThMLGVBQUosRUFBYjtBQUFtQ3pmLFFBQU0sQ0FBQ3FQLE9BQVAsQ0FBZW1RLFFBQWYsRUFBeUI3YixPQUF6QixDQUFpQyxDQUFDLENBQUN0RCxHQUFELEVBQUsySCxLQUFMLENBQUQsS0FBZTtBQUFDLFFBQUdpRyxLQUFLLENBQUNDLE9BQU4sQ0FBY2xHLEtBQWQsQ0FBSCxFQUF3QjtBQUFDQSxXQUFLLENBQUNyRSxPQUFOLENBQWMrYixJQUFJLElBQUUvTCxNQUFNLENBQUNnTSxNQUFQLENBQWN0ZixHQUFkLEVBQWtCa2Ysc0JBQXNCLENBQUNHLElBQUQsQ0FBeEMsQ0FBcEI7QUFBc0UsS0FBL0YsTUFBbUc7QUFBQy9MLFlBQU0sQ0FBQzVMLEdBQVAsQ0FBVzFILEdBQVgsRUFBZWtmLHNCQUFzQixDQUFDdlgsS0FBRCxDQUFyQztBQUErQztBQUFDLEdBQXJNO0FBQXVNLFNBQU8yTCxNQUFQO0FBQWU7O0FBQUEsU0FBUzFULE1BQVQsQ0FBZ0JpQyxNQUFoQixFQUF1QixHQUFHMGQsZ0JBQTFCLEVBQTJDO0FBQUNBLGtCQUFnQixDQUFDamMsT0FBakIsQ0FBeUIyUSxZQUFZLElBQUU7QUFBQ3JHLFNBQUssQ0FBQzRSLElBQU4sQ0FBV3ZMLFlBQVksQ0FBQzVRLElBQWIsRUFBWCxFQUFnQ0MsT0FBaEMsQ0FBd0N0RCxHQUFHLElBQUU2QixNQUFNLENBQUMrTSxNQUFQLENBQWM1TyxHQUFkLENBQTdDO0FBQWlFaVUsZ0JBQVksQ0FBQzNRLE9BQWIsQ0FBcUIsQ0FBQ3FFLEtBQUQsRUFBTzNILEdBQVAsS0FBYTZCLE1BQU0sQ0FBQ3lkLE1BQVAsQ0FBY3RmLEdBQWQsRUFBa0IySCxLQUFsQixDQUFsQztBQUE2RCxHQUF0SztBQUF3SyxTQUFPOUYsTUFBUDtBQUFlLEM7Ozs7Ozs7Ozs7O0FDQWxsQzs7QUFBQXpMLGtCQUFBLEdBQW1CLElBQW5CO0FBQXdCQSx1QkFBQSxHQUF3QjJjLGVBQXhCOztBQUF3QyxTQUFTQSxlQUFULENBQXlCZ0gsVUFBekIsRUFBb0M7QUFBQyxRQUFLO0FBQUNoRixNQUFEO0FBQUlsQztBQUFKLE1BQVlrSCxVQUFqQjtBQUE0QixTQUFPcEssUUFBUSxJQUFFO0FBQUMsVUFBTXFLLFVBQVUsR0FBQ2pGLEVBQUUsQ0FBQzNiLElBQUgsQ0FBUXVXLFFBQVIsQ0FBakI7O0FBQW1DLFFBQUcsQ0FBQ3FLLFVBQUosRUFBZTtBQUFDLGFBQU8sS0FBUDtBQUFjOztBQUFBLFVBQU12ZSxNQUFNLEdBQUN3WCxLQUFLLElBQUU7QUFBQyxVQUFHO0FBQUMsZUFBT3dNLGtCQUFrQixDQUFDeE0sS0FBRCxDQUF6QjtBQUFrQyxPQUF0QyxDQUFzQyxPQUFNMVAsQ0FBTixFQUFRO0FBQUMsY0FBTTFDLEdBQUcsR0FBQyxJQUFJM0YsS0FBSixDQUFVLHdCQUFWLENBQVY7QUFBOEMyRixXQUFHLENBQUM2ZSxJQUFKLEdBQVMsZUFBVDtBQUF5QixjQUFNN2UsR0FBTjtBQUFXO0FBQUMsS0FBdko7O0FBQXdKLFVBQU1MLE1BQU0sR0FBQyxFQUFiO0FBQWdCYixVQUFNLENBQUMwRCxJQUFQLENBQVl3UCxNQUFaLEVBQW9CdlAsT0FBcEIsQ0FBNEJxYyxRQUFRLElBQUU7QUFBQyxZQUFNQyxDQUFDLEdBQUMvTSxNQUFNLENBQUM4TSxRQUFELENBQWQ7QUFBeUIsWUFBTUUsQ0FBQyxHQUFDN0YsVUFBVSxDQUFDNEYsQ0FBQyxDQUFDRSxHQUFILENBQWxCOztBQUEwQixVQUFHRCxDQUFDLEtBQUc3b0IsU0FBUCxFQUFpQjtBQUFDd0osY0FBTSxDQUFDbWYsUUFBRCxDQUFOLEdBQWlCLENBQUNFLENBQUMsQ0FBQ2pkLE9BQUYsQ0FBVSxHQUFWLENBQUQsR0FBZ0JpZCxDQUFDLENBQUMvUCxLQUFGLENBQVEsR0FBUixFQUFhOVYsR0FBYixDQUFpQnNOLEtBQUssSUFBRTdMLE1BQU0sQ0FBQzZMLEtBQUQsQ0FBOUIsQ0FBaEIsR0FBdURzWSxDQUFDLENBQUMxTSxNQUFGLEdBQVMsQ0FBQ3pYLE1BQU0sQ0FBQ29rQixDQUFELENBQVAsQ0FBVCxHQUFxQnBrQixNQUFNLENBQUNva0IsQ0FBRCxDQUFuRztBQUF3RztBQUFDLEtBQXJOO0FBQXVOLFdBQU9yZixNQUFQO0FBQWUsR0FBamU7QUFBbWUsQzs7Ozs7Ozs7Ozs7QUNBcG1COztBQUFBcEssa0JBQUEsR0FBbUIsSUFBbkI7QUFBd0JBLHFCQUFBLEdBQXNCdWMsYUFBdEIsQyxDQUFvQztBQUN6RTs7QUFDQSxTQUFTb04sV0FBVCxDQUFxQkMsR0FBckIsRUFBeUI7QUFBQyxTQUFPQSxHQUFHLENBQUN6ZCxPQUFKLENBQVksc0JBQVosRUFBbUMsTUFBbkMsQ0FBUDtBQUFtRDs7QUFBQSxTQUFTMGQsY0FBVCxDQUF3QmhOLEtBQXhCLEVBQThCO0FBQUMsUUFBTUUsUUFBUSxHQUFDRixLQUFLLENBQUN6WCxVQUFOLENBQWlCLEdBQWpCLEtBQXVCeVgsS0FBSyxDQUFDbE4sUUFBTixDQUFlLEdBQWYsQ0FBdEM7O0FBQTBELE1BQUdvTixRQUFILEVBQVk7QUFBQ0YsU0FBSyxHQUFDQSxLQUFLLENBQUMxUyxLQUFOLENBQVksQ0FBWixFQUFjLENBQUMsQ0FBZixDQUFOO0FBQXlCOztBQUFBLFFBQU0yUyxNQUFNLEdBQUNELEtBQUssQ0FBQ3pYLFVBQU4sQ0FBaUIsS0FBakIsQ0FBYjs7QUFBcUMsTUFBRzBYLE1BQUgsRUFBVTtBQUFDRCxTQUFLLEdBQUNBLEtBQUssQ0FBQzFTLEtBQU4sQ0FBWSxDQUFaLENBQU47QUFBc0I7O0FBQUEsU0FBTTtBQUFDUCxPQUFHLEVBQUNpVCxLQUFMO0FBQVdDLFVBQVg7QUFBa0JDO0FBQWxCLEdBQU47QUFBbUM7O0FBQUEsU0FBU1IsYUFBVCxDQUF1QnVOLGVBQXZCLEVBQXVDO0FBQUMsUUFBTUMsUUFBUSxHQUFDLENBQUNELGVBQWUsQ0FBQzNkLE9BQWhCLENBQXdCLEtBQXhCLEVBQThCLEVBQTlCLEtBQW1DLEdBQXBDLEVBQXlDaEMsS0FBekMsQ0FBK0MsQ0FBL0MsRUFBa0R1UCxLQUFsRCxDQUF3RCxHQUF4RCxDQUFmO0FBQTRFLFFBQU0rQyxNQUFNLEdBQUMsRUFBYjtBQUFnQixNQUFJdU4sVUFBVSxHQUFDLENBQWY7QUFBaUIsUUFBTUMsa0JBQWtCLEdBQUNGLFFBQVEsQ0FBQ25tQixHQUFULENBQWFxWixPQUFPLElBQUU7QUFBQyxRQUFHQSxPQUFPLENBQUM3WCxVQUFSLENBQW1CLEdBQW5CLEtBQXlCNlgsT0FBTyxDQUFDdE4sUUFBUixDQUFpQixHQUFqQixDQUE1QixFQUFrRDtBQUFDLFlBQUs7QUFBQy9GLFdBQUQ7QUFBS21ULGdCQUFMO0FBQWNEO0FBQWQsVUFBc0IrTSxjQUFjLENBQUM1TSxPQUFPLENBQUM5UyxLQUFSLENBQWMsQ0FBZCxFQUFnQixDQUFDLENBQWpCLENBQUQsQ0FBekM7QUFBK0RzUyxZQUFNLENBQUM3UyxHQUFELENBQU4sR0FBWTtBQUFDOGYsV0FBRyxFQUFDTSxVQUFVLEVBQWY7QUFBa0JsTixjQUFsQjtBQUF5QkM7QUFBekIsT0FBWjtBQUErQyxhQUFPRCxNQUFNLEdBQUNDLFFBQVEsR0FBQyxhQUFELEdBQWUsUUFBeEIsR0FBaUMsV0FBOUM7QUFBMkQsS0FBNU4sTUFBZ087QUFBQyxhQUFPLElBQUc0TSxXQUFXLENBQUMxTSxPQUFELENBQVUsRUFBL0I7QUFBa0M7QUFBQyxHQUEzUixFQUE2UjNZLElBQTdSLENBQWtTLEVBQWxTLENBQXpCLENBQTlHLENBQTZhO0FBQ3p3Qjs7QUFDQSxZQUErQjtBQUFDLFFBQUk0bEIsZ0JBQWdCLEdBQUMsRUFBckI7QUFBd0IsUUFBSUMsa0JBQWtCLEdBQUMsQ0FBdkIsQ0FBekIsQ0FBa0Q7O0FBQ2pGLFVBQU1DLGVBQWUsR0FBQyxNQUFJO0FBQUMsVUFBSUMsUUFBUSxHQUFDLEVBQWI7O0FBQWdCLFdBQUksSUFBSWhtQixDQUFDLEdBQUMsQ0FBVixFQUFZQSxDQUFDLEdBQUM4bEIsa0JBQWQsRUFBaUM5bEIsQ0FBQyxFQUFsQyxFQUFxQztBQUFDZ21CLGdCQUFRLElBQUVwakIsTUFBTSxDQUFDcWpCLFlBQVAsQ0FBb0JKLGdCQUFwQixDQUFWO0FBQWdEQSx3QkFBZ0I7O0FBQUcsWUFBR0EsZ0JBQWdCLEdBQUMsR0FBcEIsRUFBd0I7QUFBQ0MsNEJBQWtCO0FBQUdELDBCQUFnQixHQUFDLEVBQWpCO0FBQXFCO0FBQUM7O0FBQUEsYUFBT0csUUFBUDtBQUFpQixLQUF6Tzs7QUFBME8sVUFBTUUsU0FBUyxHQUFDLEVBQWhCO0FBQW1CLFFBQUlDLHVCQUF1QixHQUFDVCxRQUFRLENBQUNubUIsR0FBVCxDQUFhcVosT0FBTyxJQUFFO0FBQUMsVUFBR0EsT0FBTyxDQUFDN1gsVUFBUixDQUFtQixHQUFuQixLQUF5QjZYLE9BQU8sQ0FBQ3ROLFFBQVIsQ0FBaUIsR0FBakIsQ0FBNUIsRUFBa0Q7QUFBQyxjQUFLO0FBQUMvRixhQUFEO0FBQUttVCxrQkFBTDtBQUFjRDtBQUFkLFlBQXNCK00sY0FBYyxDQUFDNU0sT0FBTyxDQUFDOVMsS0FBUixDQUFjLENBQWQsRUFBZ0IsQ0FBQyxDQUFqQixDQUFELENBQXpDLENBQUQsQ0FBZ0U7QUFDbGE7O0FBQ0EsWUFBSXNnQixVQUFVLEdBQUM3Z0IsR0FBRyxDQUFDdUMsT0FBSixDQUFZLEtBQVosRUFBa0IsRUFBbEIsQ0FBZjtBQUFxQyxZQUFJdWUsVUFBVSxHQUFDLEtBQWYsQ0FGNlQsQ0FFeFM7QUFDMUQ7O0FBQ0EsWUFBR0QsVUFBVSxDQUFDdG5CLE1BQVgsS0FBb0IsQ0FBcEIsSUFBdUJzbkIsVUFBVSxDQUFDdG5CLE1BQVgsR0FBa0IsRUFBNUMsRUFBK0M7QUFBQ3VuQixvQkFBVSxHQUFDLElBQVg7QUFBaUI7O0FBQUEsWUFBRyxDQUFDeGpCLEtBQUssQ0FBQ2hFLFFBQVEsQ0FBQ3VuQixVQUFVLENBQUNoQyxNQUFYLENBQWtCLENBQWxCLEVBQW9CLENBQXBCLENBQUQsQ0FBVCxDQUFULEVBQTRDO0FBQUNpQyxvQkFBVSxHQUFDLElBQVg7QUFBaUI7O0FBQUEsWUFBR0EsVUFBSCxFQUFjO0FBQUNELG9CQUFVLEdBQUNMLGVBQWUsRUFBMUI7QUFBOEI7O0FBQUFHLGlCQUFTLENBQUNFLFVBQUQsQ0FBVCxHQUFzQjdnQixHQUF0QjtBQUEwQixlQUFPa1QsTUFBTSxHQUFDQyxRQUFRLEdBQUUsVUFBUzBOLFVBQVcsU0FBdEIsR0FBZ0MsT0FBTUEsVUFBVyxPQUExRCxHQUFrRSxPQUFNQSxVQUFXLFVBQWhHO0FBQTJHLE9BSkQsTUFJSztBQUFDLGVBQU8sSUFBR2QsV0FBVyxDQUFDMU0sT0FBRCxDQUFVLEVBQS9CO0FBQWtDO0FBQUMsS0FKaEUsRUFJa0UzWSxJQUpsRSxDQUl1RSxFQUp2RSxDQUE1QjtBQUl1RyxXQUFNO0FBQUNxYSxRQUFFLEVBQUMsSUFBSWdNLE1BQUosQ0FBWSxJQUFHVixrQkFBbUIsU0FBbEMsQ0FBSjtBQUFnRHhOLFlBQWhEO0FBQXVEOE4sZUFBdkQ7QUFBaUVLLGdCQUFVLEVBQUUsSUFBR0osdUJBQXdCO0FBQXhHLEtBQU47QUFBeUg7O0FBQUEsU0FBTTtBQUFDN0wsTUFBRSxFQUFDLElBQUlnTSxNQUFKLENBQVksSUFBR1Ysa0JBQW1CLFNBQWxDLENBQUo7QUFBZ0R4TjtBQUFoRCxHQUFOO0FBQStELEM7Ozs7Ozs7Ozs7O0FDVC9nQjs7QUFBQXpjLGtCQUFBLEdBQW1CLElBQW5CO0FBQXdCQSxnQkFBQSxHQUFpQjZxQixRQUFqQjtBQUEwQjdxQix5QkFBQSxHQUEwQmdjLGlCQUExQjtBQUE0Q2hjLGNBQUEsR0FBZW9oQixNQUFmO0FBQXNCcGhCLHNCQUFBLEdBQXVCOHFCLGNBQXZCO0FBQXNDOXFCLGlCQUFBLEdBQWtCK3FCLFNBQWxCO0FBQTRCL3FCLDJCQUFBLEdBQTRCcW5CLG1CQUE1QjtBQUFnRHJuQiw0QkFBQSxHQUE2QndkLG9CQUE3QjtBQUFrRHhkLFVBQUEsR0FBV0EsVUFBQSxHQUFXQSxxQkFBQSxHQUFzQixLQUFLLENBQWpEOztBQUFtRCxJQUFJZ3JCLFVBQVUsR0FBQ2pyQixtQkFBTyxDQUFDLHNHQUFELENBQXRCO0FBQW9EO0FBQzVZO0FBQ0E7OztBQUFHLFNBQVM4cUIsUUFBVCxDQUFrQjlWLEVBQWxCLEVBQXFCO0FBQUMsTUFBSWtXLElBQUksR0FBQyxLQUFUO0FBQWUsTUFBSS9OLE1BQUo7QUFBVyxTQUFNLENBQUMsR0FBR3RRLElBQUosS0FBVztBQUFDLFFBQUcsQ0FBQ3FlLElBQUosRUFBUztBQUFDQSxVQUFJLEdBQUMsSUFBTDtBQUFVL04sWUFBTSxHQUFDbkksRUFBRSxDQUFDLEdBQUduSSxJQUFKLENBQVQ7QUFBb0I7O0FBQUEsV0FBT3NRLE1BQVA7QUFBZSxHQUF6RTtBQUEyRTs7QUFBQSxTQUFTbEIsaUJBQVQsR0FBNEI7QUFBQyxRQUFLO0FBQUNxTSxZQUFEO0FBQVUxZCxZQUFWO0FBQW1CNGQ7QUFBbkIsTUFBeUI1VyxNQUFNLENBQUN1USxRQUFyQztBQUE4QyxTQUFPLEdBQUVtRyxRQUFTLEtBQUkxZCxRQUFTLEdBQUU0ZCxJQUFJLEdBQUMsTUFBSUEsSUFBTCxHQUFVLEVBQUcsRUFBbEQ7QUFBcUQ7O0FBQUEsU0FBU25ILE1BQVQsR0FBaUI7QUFBQyxRQUFLO0FBQUNyWDtBQUFELE1BQU80SCxNQUFNLENBQUN1USxRQUFuQjtBQUE0QixRQUFNaEcsTUFBTSxHQUFDRixpQkFBaUIsRUFBOUI7QUFBaUMsU0FBT2pTLElBQUksQ0FBQ2dOLFNBQUwsQ0FBZW1GLE1BQU0sQ0FBQy9ZLE1BQXRCLENBQVA7QUFBc0M7O0FBQUEsU0FBUzJuQixjQUFULENBQXdCN0ssU0FBeEIsRUFBa0M7QUFBQyxTQUFPLE9BQU9BLFNBQVAsS0FBbUIsUUFBbkIsR0FBNEJBLFNBQTVCLEdBQXNDQSxTQUFTLENBQUM1RyxXQUFWLElBQXVCNEcsU0FBUyxDQUFDN0csSUFBakMsSUFBdUMsU0FBcEY7QUFBK0Y7O0FBQUEsU0FBUzJSLFNBQVQsQ0FBbUI1WSxHQUFuQixFQUF1QjtBQUFDLFNBQU9BLEdBQUcsQ0FBQytZLFFBQUosSUFBYy9ZLEdBQUcsQ0FBQ2daLFdBQXpCO0FBQXNDOztBQUFBLGVBQWU5RCxtQkFBZixDQUFtQ3RILEdBQW5DLEVBQXVDb0gsR0FBdkMsRUFBMkM7QUFBQyxZQUF1QztBQUFDLFFBQUlpRSxjQUFKOztBQUFtQixRQUFHLENBQUNBLGNBQWMsR0FBQ3JMLEdBQUcsQ0FBQytILFNBQXBCLEtBQWdDLElBQWhDLElBQXNDc0QsY0FBYyxDQUFDbFMsZUFBeEQsRUFBd0U7QUFBQyxZQUFNakMsT0FBTyxHQUFFLElBQUc2VCxjQUFjLENBQUMvSyxHQUFELENBQU0sNkpBQXRDO0FBQW1NLFlBQU0sSUFBSWpiLEtBQUosQ0FBVW1TLE9BQVYsQ0FBTjtBQUEwQjtBQUFDLEdBQW5XLENBQW1XOzs7QUFDajhCLFFBQU05RSxHQUFHLEdBQUNnVixHQUFHLENBQUNoVixHQUFKLElBQVNnVixHQUFHLENBQUNBLEdBQUosSUFBU0EsR0FBRyxDQUFDQSxHQUFKLENBQVFoVixHQUFwQzs7QUFBd0MsTUFBRyxDQUFDNE4sR0FBRyxDQUFDN0csZUFBUixFQUF3QjtBQUFDLFFBQUdpTyxHQUFHLENBQUNBLEdBQUosSUFBU0EsR0FBRyxDQUFDbEgsU0FBaEIsRUFBMEI7QUFBQztBQUM1RixhQUFNO0FBQUNtRSxpQkFBUyxFQUFDLE1BQU1pRCxtQkFBbUIsQ0FBQ0YsR0FBRyxDQUFDbEgsU0FBTCxFQUFla0gsR0FBRyxDQUFDQSxHQUFuQjtBQUFwQyxPQUFOO0FBQW9FOztBQUFBLFdBQU0sRUFBTjtBQUFVOztBQUFBLFFBQU16YSxLQUFLLEdBQUMsTUFBTXFULEdBQUcsQ0FBQzdHLGVBQUosQ0FBb0JpTyxHQUFwQixDQUFsQjs7QUFBMkMsTUFBR2hWLEdBQUcsSUFBRTRZLFNBQVMsQ0FBQzVZLEdBQUQsQ0FBakIsRUFBdUI7QUFBQyxXQUFPekYsS0FBUDtBQUFjOztBQUFBLE1BQUcsQ0FBQ0EsS0FBSixFQUFVO0FBQUMsVUFBTXVLLE9BQU8sR0FBRSxJQUFHNlQsY0FBYyxDQUFDL0ssR0FBRCxDQUFNLCtEQUE4RHJULEtBQU0sWUFBMUc7QUFBc0gsVUFBTSxJQUFJNUgsS0FBSixDQUFVbVMsT0FBVixDQUFOO0FBQTBCOztBQUFBLFlBQXVDO0FBQUMsUUFBRzFOLE1BQU0sQ0FBQzBELElBQVAsQ0FBWVAsS0FBWixFQUFtQnZKLE1BQW5CLEtBQTRCLENBQTVCLElBQStCLENBQUNna0IsR0FBRyxDQUFDQSxHQUF2QyxFQUEyQztBQUFDaGdCLGFBQU8sQ0FBQ0MsSUFBUixDQUFjLEdBQUUwakIsY0FBYyxDQUFDL0ssR0FBRCxDQUFNLGlMQUFwQztBQUF1TjtBQUFDOztBQUFBLFNBQU9yVCxLQUFQO0FBQWM7O0FBQUEsTUFBTTJlLGFBQWEsR0FBQyxDQUFDLE1BQUQsRUFBUSxNQUFSLEVBQWUsTUFBZixFQUFzQixVQUF0QixFQUFpQyxNQUFqQyxFQUF3QyxNQUF4QyxFQUErQyxVQUEvQyxFQUEwRCxNQUExRCxFQUFpRSxVQUFqRSxFQUE0RSxPQUE1RSxFQUFvRixRQUFwRixFQUE2RixTQUE3RixDQUFwQjtBQUE0SHJyQixxQkFBQSxHQUFzQnFyQixhQUF0Qjs7QUFBb0MsU0FBUzdOLG9CQUFULENBQThCMUIsR0FBOUIsRUFBa0M7QUFBQyxZQUF3QztBQUFDLFFBQUdBLEdBQUcsS0FBRyxJQUFOLElBQVksT0FBT0EsR0FBUCxLQUFhLFFBQTVCLEVBQXFDO0FBQUN2UyxZQUFNLENBQUMwRCxJQUFQLENBQVk2TyxHQUFaLEVBQWlCNU8sT0FBakIsQ0FBeUJ0RCxHQUFHLElBQUU7QUFBQyxZQUFHeWhCLGFBQWEsQ0FBQzdlLE9BQWQsQ0FBc0I1QyxHQUF0QixNQUE2QixDQUFDLENBQWpDLEVBQW1DO0FBQUN6QyxpQkFBTyxDQUFDQyxJQUFSLENBQWMscURBQW9Ed0MsR0FBSSxFQUF0RTtBQUEwRTtBQUFDLE9BQTlJO0FBQWlKO0FBQUM7O0FBQUEsU0FBTSxDQUFDLEdBQUVvaEIsVUFBVSxDQUFDMUQsU0FBZCxFQUF5QnhMLEdBQXpCLENBQU47QUFBcUM7O0FBQUEsTUFBTXdQLEVBQUUsR0FBQyxPQUFPekksV0FBUCxLQUFxQixXQUE5QjtBQUEwQzdpQixVQUFBLEdBQVdzckIsRUFBWDtBQUFjLE1BQU0xSSxFQUFFLEdBQUMwSSxFQUFFLElBQUUsT0FBT3pJLFdBQVcsQ0FBQ0MsSUFBbkIsS0FBMEIsVUFBOUIsSUFBMEMsT0FBT0QsV0FBVyxDQUFDMEksT0FBbkIsS0FBNkIsVUFBaEY7QUFBMkZ2ckIsVUFBQSxHQUFXNGlCLEVBQVgsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNKaHRDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRWUsU0FBUzRJLEtBQVQsQ0FBZTtBQUFFdkwsV0FBRjtBQUFhbUU7QUFBYixDQUFmLEVBQXlDO0FBRXRENVYsa0RBQVMsQ0FBQyxNQUFNO0FBQ2Q7QUFDQSxVQUFNaWQsU0FBUyxHQUFHL1osUUFBUSxDQUFDVyxhQUFULENBQXVCLGtCQUF2QixDQUFsQjs7QUFDQSxRQUFJb1osU0FBSixFQUFlO0FBQ2JBLGVBQVMsQ0FBQ0MsYUFBVixDQUF3QkMsV0FBeEIsQ0FBb0NGLFNBQXBDO0FBQ0Q7QUFDRixHQU5RLEVBTU4sRUFOTSxDQUFUO0FBUUEsUUFBTUcsV0FBVyxHQUFHLElBQUlDLG9EQUFKLENBQWdCO0FBQ2xDQyxrQkFBYyxFQUFFO0FBQ2RDLGFBQU8sRUFBRTtBQUNQQyw0QkFBb0IsRUFBRSxLQURmO0FBRVBDLHNCQUFjLEVBQUUsS0FGVDtBQUdQQywwQkFBa0IsRUFBRSxLQUhiO0FBSVBDLGFBQUssRUFBRTtBQUpBO0FBREs7QUFEa0IsR0FBaEIsQ0FBcEI7QUFXQSxzQkFDRSw4REFBQyw0REFBRDtBQUFxQixVQUFNLEVBQUVQLFdBQTdCO0FBQUEsMkJBQ0UsOERBQUMsNERBQUQ7QUFBQSw4QkFDRSw4REFBQyxtRkFBRDtBQUFBO0FBQUE7QUFBQTtBQUFBLGNBREYsZUFFRSw4REFBQywrRkFBRDtBQUFBO0FBQUE7QUFBQTtBQUFBLGNBRkYsZUFHRSw4REFBQyxTQUFELG9CQUFleEgsU0FBZjtBQUFBO0FBQUE7QUFBQTtBQUFBLGNBSEY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBREY7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQURGO0FBVUQ7QUFDRG9ILEtBQUssQ0FBQ1ksU0FBTixHQUFrQjtBQUNoQm5NLFdBQVMsRUFBRW9NLDBFQURLO0FBRWhCakksV0FBUyxFQUFFaUkscUVBQTJCQztBQUZ0QixDQUFsQixDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN6Q08sTUFBTUMsUUFBUSxHQUFHLHVCQUFqQjtBQUNBLE1BQU1DLGNBQWMsR0FBRyxPQUF2QjtBQUNBLE1BQU1DLGNBQWMsR0FBRyxPQUF2QjtBQUNBLE1BQU1DLGFBQWEsR0FBRyxPQUF0QixDOzs7Ozs7Ozs7Ozs7Ozs7QUNIUDs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7OztBQUVBLE1BQU1DLFVBQVUsZ0JBQUcsMkJBQW5COztBQUVBLE1BQU1DLFVBQVUsR0FBRyxDQUFDO0FBQUU1ZTtBQUFGLENBQUQsS0FBa0I7QUFDbkMsUUFBTTtBQUFBLE9BQUM2ZSxJQUFEO0FBQUEsT0FBT0M7QUFBUCxNQUFtQix1QkFBV0Msd0JBQVgsRUFBd0JDLDBCQUF4QixDQUF6QjtBQUNBLFFBQU07QUFBQSxPQUFDQyxNQUFEO0FBQUEsT0FBU0M7QUFBVCxNQUFzQix1QkFBV0Msd0JBQVgsRUFBd0JDLDBCQUF4QixDQUE1QjtBQUVBLHdCQUFVLFlBQVk7QUFDcEIsUUFBSUMsVUFBVSxHQUFHLElBQUlDLGVBQUosRUFBakI7O0FBRUEsbUJBQWVDLFdBQWYsR0FBNkI7QUFDM0IsWUFBTUMsUUFBUSxHQUFHLE1BQU1oWixLQUFLLENBQUUsR0FBRStYLGlCQUFTLGdCQUFiLEVBQThCO0FBQ3hEdk4sbUJBQVcsRUFBRSxTQUQyQztBQUV4RHlPLGNBQU0sRUFBRUosVUFBVSxDQUFDSTtBQUZxQyxPQUE5QixDQUE1Qjs7QUFLQSxVQUFJRCxRQUFRLENBQUN2TyxNQUFULElBQW1CLEdBQXZCLEVBQTRCO0FBQzFCLGNBQU07QUFBRTROLGNBQUY7QUFBUXhqQixjQUFSO0FBQWNxa0I7QUFBZCxZQUEwQixNQUFNRixRQUFRLENBQUN0TyxJQUFULEVBQXRDO0FBRUE0TixnQkFBUSxDQUFDO0FBQ1AvZCxjQUFJLEVBQUUsUUFEQztBQUVQNGUsaUJBQU8sa0NBQ0ZkLElBREU7QUFFTHhqQixnQkFBSSxFQUFFQSxJQUFJLENBQUNBLElBRk47QUFHTHVrQixvQkFBUSxFQUFFdmtCLElBQUksQ0FBQ3VrQixRQUhWO0FBSUxGO0FBSks7QUFGQSxTQUFELENBQVI7QUFTRDtBQUNGOztBQUVESCxlQUFXO0FBRVgsV0FBTyxNQUFNRixVQUFVLENBQUNRLEtBQVgsRUFBYjtBQUNELEdBM0JELEVBMkJHLEVBM0JIO0FBNkJBLHNCQUNFLDJCQUFDLFVBQUQsQ0FBWSxRQUFaO0FBQ0UsU0FBSyxFQUFFO0FBQUVoQixVQUFGO0FBQVFpQixhQUFPLEVBQUVoQixRQUFqQjtBQUEyQkcsWUFBM0I7QUFBbUNjLGtCQUFZLEVBQUViO0FBQWpELEtBRFQ7QUFBQSxjQUdHbGY7QUFISDtBQUFBO0FBQUE7QUFBQTtBQUFBLFlBREY7QUFPRCxDQXhDRDs7QUEwQ0EsTUFBTWdnQixhQUFhLEdBQUcsTUFBTTtBQUMxQixTQUFPLHVCQUFXckIsVUFBWCxDQUFQO0FBQ0QsQ0FGRDs7QUFJQXNCLE1BQU0sQ0FBQ2p1QixPQUFQLEdBQWlCO0FBQ2Y0c0IsWUFEZTtBQUVmb0I7QUFGZSxDQUFqQixDOzs7Ozs7Ozs7O0FDckRBLE1BQU1aLGFBQWEsR0FBRyxFQUF0Qjs7QUFFQSxNQUFNRCxXQUFXLEdBQUcsQ0FBQ2pNLEtBQUQsRUFBUWdOLE1BQVIsS0FBbUI7QUFDckMsVUFBUUEsTUFBTSxDQUFDbmYsSUFBZjtBQUNFLFNBQUssU0FBTDtBQUFnQjtBQUNkLFlBQUlvZixRQUFRLEdBQUdqTixLQUFLLENBQUNrTixNQUFOLENBQWE7QUFDMUJDLGNBQUksRUFBRUgsTUFBTSxDQUFDUCxPQUFQLENBQWVVLElBREs7QUFFMUI3ZCxZQUFFLEVBQUUwZCxNQUFNLENBQUNQLE9BQVAsQ0FBZW5kO0FBRk8sU0FBYixDQUFmO0FBS0EsZUFBTzJkLFFBQVA7QUFDRDs7QUFDRCxTQUFLLFlBQUw7QUFBbUI7QUFDakIsWUFBSUEsUUFBUSxHQUFHak4sS0FBSyxDQUFDMWQsTUFBTixDQUFjOHFCLEdBQUQsSUFBUztBQUNuQyxpQkFBT0EsR0FBRyxDQUFDOWQsRUFBSixLQUFXMGQsTUFBTSxDQUFDUCxPQUFQLENBQWVuZCxFQUFqQztBQUNELFNBRmMsQ0FBZjtBQUlBLGVBQU8yZCxRQUFQO0FBQ0Q7O0FBRUQ7QUFDRSxhQUFPak4sS0FBUDtBQWxCSjtBQW9CRCxDQXJCRDs7QUF1QkErTSxNQUFNLENBQUNqdUIsT0FBUCxHQUFpQjtBQUFFbXRCLGFBQUY7QUFBZUM7QUFBZixDQUFqQixDOzs7Ozs7Ozs7Ozs7Ozs7O0FDekJBLE1BQU1KLGFBQWEsR0FBRztBQUNwQnVCLFVBQVEsRUFBRSxFQURVO0FBRXBCQyxRQUFNLEVBQUUsRUFGWTtBQUdwQm5sQixNQUFJLEVBQUUsRUFIYztBQUlwQnVrQixVQUFRLEVBQUUsRUFKVTtBQUtwQmEsVUFBUSxFQUFFLEVBTFU7QUFNcEJDLGNBQVksRUFBRSxFQU5NO0FBT3BCQyxlQUFhLEVBQUUsRUFQSztBQVFwQkMsZ0JBQWMsRUFBRSxFQVJJO0FBU3BCcGUsSUFBRSxFQUFFLEVBVGdCO0FBVXBCcWUsUUFBTSxFQUFFLEVBVlk7QUFXcEJDLE9BQUssRUFBRSxFQVhhO0FBWXBCcEIsU0FBTyxFQUFFO0FBWlcsQ0FBdEI7O0FBZUEsTUFBTVgsV0FBVyxHQUFHLENBQUM3TCxLQUFELEVBQVFnTixNQUFSLEtBQW1CO0FBQ3JDLFVBQVFBLE1BQU0sQ0FBQ25mLElBQWY7QUFDRSxTQUFLLFFBQUw7QUFDRSwrQkFBWW1mLE1BQU0sQ0FBQ1AsT0FBbkI7O0FBRUYsU0FBSyxNQUFMO0FBQ0UsNkNBQ0t6TSxLQURMO0FBRUVxTixnQkFBUSxFQUFFTCxNQUFNLENBQUNQLE9BQVAsQ0FBZVksUUFGM0I7QUFHRU8sYUFBSyxFQUFFWixNQUFNLENBQUNQLE9BQVAsQ0FBZW1CLEtBSHhCO0FBSUVELGNBQU0sRUFBRVgsTUFBTSxDQUFDUCxPQUFQLENBQWVrQjtBQUp6Qjs7QUFPRixTQUFLLFFBQUw7QUFDRSw2Q0FDSzNOLEtBREw7QUFFRXlOLHFCQUFhLEVBQUVULE1BQU0sQ0FBQ1AsT0FBUCxDQUFlZ0IsYUFGaEM7QUFHRUMsc0JBQWMsRUFBRVYsTUFBTSxDQUFDUCxPQUFQLENBQWVpQjtBQUhqQzs7QUFNRjtBQUNFLGFBQU8xTixLQUFQO0FBcEJKO0FBc0JELENBdkJEOztBQXlCQStNLE1BQU0sQ0FBQ2p1QixPQUFQLEdBQWlCO0FBQUUrc0IsYUFBRjtBQUFlQztBQUFmLENBQWpCLEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeENBO0FBQ0E7O0FBRUEsTUFBTStCLFVBQVUsR0FBRyxDQUFDO0FBQ2xCQyx1QkFEa0I7QUFFbEJDLG9CQUZrQjtBQUdsQkMsYUFIa0I7QUFJbEJDO0FBSmtCLENBQUQsS0FLYjtBQUNKLFFBQU1DLHFCQUFxQixHQUFJbGpCLENBQUQsSUFBTztBQUNuQyxRQUFJZ2pCLFdBQVcsS0FBSyxRQUFwQixFQUE4QjtBQUM1QkYsMkJBQXFCLENBQUMsRUFBRCxDQUFyQjtBQUNBRyxvQkFBYyxDQUFDLEVBQUQsQ0FBZDtBQUNELEtBSEQsTUFHTztBQUNMRix3QkFBa0IsQ0FBQyxNQUFELENBQWxCO0FBQ0FFLG9CQUFjLENBQUMsUUFBRCxDQUFkO0FBQ0FILDJCQUFxQixDQUFDLG1CQUFELENBQXJCO0FBQ0Q7QUFDRixHQVREOztBQVdBLHNCQUNFO0FBQUssYUFBUyxFQUFDLHFDQUFmO0FBQUEsMkJBQ0U7QUFDRSxlQUFTLEVBQUcsR0FBRTFaLG9FQUFZLElBQUdBLCtEQUFNLENBQUM0WixXQUFELENBQWMsRUFEbkQ7QUFFRSxhQUFPLEVBQUVFLHFCQUZYO0FBQUEsNkJBSUU7QUFBSyxhQUFLLEVBQUMsSUFBWDtBQUFnQixjQUFNLEVBQUMsSUFBdkI7QUFBNEIsZUFBTyxFQUFDLGFBQXBDO0FBQUEsZ0NBQ0U7QUFDRSxtQkFBUyxFQUFHLEdBQUU5WixvRUFBWSxJQUFHQSxxRUFBYSxFQUQ1QztBQUVFLFdBQUMsRUFBQztBQUZKO0FBQUE7QUFBQTtBQUFBO0FBQUEscUJBREYsZUFLRTtBQUFNLG1CQUFTLEVBQUcsR0FBRUEsb0VBQVksSUFBR0EscUVBQWEsRUFBaEQ7QUFBbUQsV0FBQyxFQUFDO0FBQXJEO0FBQUE7QUFBQTtBQUFBO0FBQUEscUJBTEYsZUFNRTtBQUNFLG1CQUFTLEVBQUcsR0FBRUEsb0VBQVksSUFBR0EscUVBQWEsRUFENUM7QUFFRSxXQUFDLEVBQUM7QUFGSjtBQUFBO0FBQUE7QUFBQTtBQUFBLHFCQU5GO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUpGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFERjtBQUFBO0FBQUE7QUFBQTtBQUFBLGVBREY7QUFvQkQsQ0FyQ0Q7O0FBdUNBLDRFQUFlK1osaURBQUEsQ0FBV04sVUFBWCxDQUFmLEU7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzFDQTs7QUFFQSxNQUFNTyxPQUFPLEdBQUcsTUFBTTtBQUNwQixzQkFDRTtBQUFLLGFBQVMsRUFBQyxxQ0FBZjtBQUFBLDJCQUNFO0FBQVEsVUFBSSxFQUFDLFFBQWI7QUFBc0IsZUFBUyxFQUFHLEdBQUVoYSw2REFBWSxFQUFoRDtBQUFBLDZCQUNFO0FBQUcsaUJBQVMsRUFBQyxpQkFBYjtBQUErQix1QkFBWTtBQUEzQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBREY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQURGO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUFERjtBQU9ELENBUkQ7O0FBVUEsK0RBQWVnYSxPQUFmLEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE1BQU1DLGlCQUFpQixHQUFHLENBQUM7QUFDekJDLDBCQUR5QjtBQUV6QjNDLE1BRnlCO0FBR3pCNEMsZUFIeUI7QUFJekJDO0FBSnlCLENBQUQsS0FLcEI7QUFDSixRQUFNO0FBQUEsT0FBQ0MsU0FBRDtBQUFBLE9BQVlDO0FBQVosTUFBNEI1WCwrQ0FBUSxDQUFDLEVBQUQsQ0FBMUM7QUFFQXhKLGtEQUFTLENBQUMsTUFBTTtBQUNkLGFBQVNxaEIsYUFBVCxDQUF1QjNqQixDQUF2QixFQUEwQjtBQUN4QixVQUFJVCxNQUFNLEdBQUdTLENBQUMsQ0FBQ1QsTUFBRixDQUFTcWtCLE9BQVQsQ0FBaUIsbUJBQWpCLENBQWI7O0FBQ0EsVUFBSSxDQUFDcmtCLE1BQUwsRUFBYTtBQUNYbWtCLG9CQUFZLENBQUMsRUFBRCxDQUFaO0FBQ0FILHFCQUFhLENBQUMsRUFBRCxDQUFiO0FBQ0Q7O0FBQ0Q7QUFDRDs7QUFFRCxRQUFJRSxTQUFTLEtBQUssRUFBbEIsRUFBc0I7QUFDcEJqZSxjQUFRLENBQUNxZSxnQkFBVCxDQUEwQixPQUExQixFQUFtQ0YsYUFBbkM7QUFDRDs7QUFFRCxXQUFPLE1BQU1uZSxRQUFRLENBQUNzZSxtQkFBVCxDQUE2QixPQUE3QixFQUFzQ0gsYUFBdEMsQ0FBYjtBQUNELEdBZlEsRUFlTixDQUFDRixTQUFELENBZk0sQ0FBVDtBQWlCQSxzQkFDRTtBQUFLLGFBQVMsRUFBQyx5REFBZjtBQUFBLDRCQUNFO0FBQUssZUFBUyxFQUFDLE9BQWY7QUFBQSw2QkFDRSw4REFBQywrQ0FBRDtBQUFNLGFBQUssRUFBRSxFQUFiO0FBQWlCLGNBQU0sRUFBRSxFQUF6QjtBQUE2QixZQUFJLEVBQUVNLHFEQUFJQTtBQUF2QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBREY7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFERixlQUlFO0FBQUssZUFBUyxFQUFHLFNBQVFULHdCQUF5QixFQUFsRDtBQUFBLDhCQUNFLDhEQUFDLHlEQUFEO0FBQ0Usb0JBQVksRUFBRUksWUFEaEI7QUFFRSxlQUFPLEVBQUUsSUFGWDtBQUdFLHFCQUFhLEVBQUVIO0FBSGpCO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBREYsZUFNRSw4REFBQyx5REFBRDtBQUNFLFdBQUcsRUFBQyxrQ0FETjtBQUVFLGtCQUFVLEVBQUM7QUFGYjtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQU5GO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFKRixlQWVFLDhEQUFDLGlEQUFEO0FBQWEsZUFBUyxFQUFDO0FBQXZCO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBZkYsZUFnQkUsOERBQUMsNkRBQUQ7QUFBVyxhQUFPLEVBQUM7QUFBbkI7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFoQkYsZUFpQkU7QUFBSyxlQUFTLEVBQUMsT0FBZjtBQUFBLGdCQUNHNUMsSUFBSSxTQUFKLElBQUFBLElBQUksV0FBSixJQUFBQSxJQUFJLENBQUUwQixRQUFOLEtBQW1CMUIsSUFBSSxTQUFKLElBQUFBLElBQUksV0FBSixJQUFBQSxJQUFJLENBQUU4QixhQUFOLElBQXVCOUIsSUFBdkIsYUFBdUJBLElBQXZCLGVBQXVCQSxJQUFJLENBQUUrQixjQUFoRCxpQkFDQyw4REFBQywrQ0FBRDtBQUFNLHFCQUFhLEVBQUMsZ0JBQXBCO0FBQXFDLFlBQUksRUFBRS9CO0FBQTNDO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBREQsZ0JBR0MsOERBQUMsd0ZBQUQ7QUFBb0IsbUJBQVcsRUFBRTtBQUFqQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSko7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFqQkYsZUF3QkUsOERBQUMscURBQUQ7QUFBUyxlQUFTLEVBQUU4QyxTQUFwQjtBQUErQixrQkFBWSxFQUFDLHlCQUE1QztBQUFBLDZCQUNFLDhEQUFDLHNFQUFEO0FBQ0Usc0JBQWMsRUFBQyxrQ0FEakI7QUFFRSxrQkFBVSxFQUFFRDtBQUZkO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFERjtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQXhCRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUFERjtBQWlDRCxDQTFERDs7QUE0REEsK0RBQWVILGlCQUFmLEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxNQUFNVyxZQUFZLEdBQUcsQ0FBQztBQUFFckQsTUFBRjtBQUFRNEMsZUFBUjtBQUF1QkM7QUFBdkIsQ0FBRCxLQUF5QztBQUM1RCxzQkFDRTtBQUFBLDRCQUNFO0FBQUssZUFBUyxFQUFDLDJFQUFmO0FBQUEsOEJBQ0U7QUFBSyxpQkFBUyxFQUFDLE9BQWY7QUFBQSwrQkFDRSw4REFBQywrQ0FBRDtBQUFNLGVBQUssRUFBRSxFQUFiO0FBQWlCLGdCQUFNLEVBQUUsRUFBekI7QUFBNkIsY0FBSSxFQUFFUywyREFBVUE7QUFBN0M7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQURGO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBREYsZUFJRTtBQUFLLGlCQUFTLEVBQUMsNENBQWY7QUFBQSxrQkFDR3RELElBQUksU0FBSixJQUFBQSxJQUFJLFdBQUosSUFBQUEsSUFBSSxDQUFFMEIsUUFBTixLQUFtQjFCLElBQUksU0FBSixJQUFBQSxJQUFJLFdBQUosSUFBQUEsSUFBSSxDQUFFOEIsYUFBTixJQUF1QjlCLElBQXZCLGFBQXVCQSxJQUF2QixlQUF1QkEsSUFBSSxDQUFFK0IsY0FBaEQsaUJBQ0MsOERBQUMsK0NBQUQ7QUFBTSx1QkFBYSxFQUFDLHNCQUFwQjtBQUEyQyxjQUFJLEVBQUUvQjtBQUFqRDtBQUFBO0FBQUE7QUFBQTtBQUFBLHFCQURELGdCQUdDLDhEQUFDLHdGQUFEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFKSjtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQUpGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFERixlQWFFLDhEQUFDLHlEQUFEO0FBQVcsbUJBQWEsRUFBRTRDLGFBQTFCO0FBQXlDLGdCQUFVLEVBQUVDO0FBQXJEO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBYkY7QUFBQSxrQkFERjtBQWlCRCxDQWxCRDs7QUFvQkEsK0RBQWVRLFlBQWYsRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsTUFBTUUsU0FBUyxHQUFHLENBQUM7QUFBRVYsWUFBRjtBQUFjRDtBQUFkLENBQUQsS0FBbUM7QUFDbkQsUUFBTTtBQUFBLE9BQUNZLGtCQUFEO0FBQUEsT0FBcUJyQjtBQUFyQixNQUE4Q2hYLCtDQUFRLENBQUMsRUFBRCxDQUE1RDtBQUNBLFFBQU07QUFBQSxPQUFDc1ksZUFBRDtBQUFBLE9BQWtCckI7QUFBbEIsTUFBd0NqWCwrQ0FBUSxDQUFDLFFBQUQsQ0FBdEQ7QUFDQSxRQUFNO0FBQUEsT0FBQ2tYLFdBQUQ7QUFBQSxPQUFjQztBQUFkLE1BQWdDblgsK0NBQVEsQ0FBQyxFQUFELENBQTlDO0FBRUEsTUFBSXVZLGVBQWUsR0FDakJELGVBQWUsS0FBSyxNQUFwQixnQkFDRTtBQUFBLDRCQUNFLDhEQUFDLHlEQUFEO0FBQVcsU0FBRyxFQUFDLHNCQUFmO0FBQXNDLGdCQUFVLEVBQUM7QUFBakQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFERixlQUVFLDhEQUFDLDREQUFEO0FBQVcsYUFBTyxFQUFDO0FBQW5CO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBRkYsZUFHRSw4REFBQyxpREFBRDtBQUFhLGVBQVMsRUFBQztBQUF2QjtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQUhGO0FBQUEsa0JBREYsR0FNSUEsZUFBZSxLQUFLLFFBQXBCLGdCQUNGLDhEQUFDLHFFQUFEO0FBQ0Usa0JBQWMsRUFBQyw2QkFEakI7QUFFRSxjQUFVLEVBQUVaO0FBRmQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxlQURFLGdCQU1GO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGVBYko7QUFnQkEsc0JBQ0U7QUFDRSxhQUFTLEVBQUcsZ0VBQStEcGEseUVBQWlCLEVBRDlGO0FBQUEsNEJBR0UsOERBQUMsMkRBQUQ7QUFDRSwyQkFBcUIsRUFBRTBaLHFCQUR6QjtBQUVFLHdCQUFrQixFQUFFQyxrQkFGdEI7QUFHRSxpQkFBVyxFQUFFQyxXQUhmO0FBSUUsb0JBQWMsRUFBRUM7QUFKbEI7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFIRixlQVNFO0FBQ0UsZUFBUyxFQUFHLG1GQUFrRjdaLDRFQUFvQixFQURwSDtBQUFBLDhCQUdFLDhEQUFDLHlEQUFEO0FBQ0Usb0JBQVksRUFBRTBaLHFCQURoQjtBQUVFLDBCQUFrQixFQUFFQyxrQkFGdEI7QUFHRSxzQkFBYyxFQUFFRSxjQUhsQjtBQUlFLHFCQUFhLEVBQUVNO0FBSmpCO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBSEYsZUFTRSw4REFBQyxxREFBRDtBQUFTLGlCQUFTLEVBQUVZLGtCQUFwQjtBQUF3QyxvQkFBWSxFQUFDLGFBQXJEO0FBQUEsa0JBQ0dFO0FBREg7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFURjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBVEYsZUFzQkUsOERBQUMscURBQUQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkF0QkY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGVBREY7QUEwQkQsQ0EvQ0Q7O0FBaURBLCtEQUFlSCxTQUFmLEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxNQUFNSSxhQUFhLEdBQUcsTUFBTTtBQUMxQixRQUFNO0FBQUUzRDtBQUFGLE1BQVdtQiwrREFBYSxFQUE5QjtBQUVBLFFBQU07QUFBQSxPQUFDMEIsVUFBRDtBQUFBLE9BQWFEO0FBQWIsTUFBOEJ6WCwrQ0FBUSxDQUFDLEVBQUQsQ0FBNUM7QUFFQSxzQkFDRTtBQUFBLDJCQUNFO0FBQ0UsZUFBUyxFQUFHLDJEQUEwRDFDLHlFQUFjLEVBRHRGO0FBQUEsOEJBR0UsOERBQUMseUVBQUQ7QUFDRSxnQ0FBd0IsRUFBRUEsMkZBRDVCO0FBRUUsWUFBSSxFQUFFdVgsSUFGUjtBQUdFLGtCQUFVLEVBQUU2QyxVQUhkO0FBSUUscUJBQWEsRUFBRUQ7QUFKakI7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFIRixlQVNFLDhEQUFDLCtEQUFEO0FBQ0UsWUFBSSxFQUFFNUMsSUFEUjtBQUVFLGtCQUFVLEVBQUU2QyxVQUZkO0FBR0UscUJBQWEsRUFBRUQ7QUFIakI7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFURjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFERixtQkFERjtBQW1CRCxDQXhCRDs7QUEwQkEsK0RBQWVlLGFBQWYsRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaENBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE1BQU1DLFdBQVcsR0FBRyxDQUFDO0FBQUVDO0FBQUYsQ0FBRCxLQUFtQjtBQUNyQyxRQUFNO0FBQUV2UixRQUFJLEVBQUV3UjtBQUFSLE1BQTJCQyxxREFBUSxDQUN2QyxvQkFEdUMsRUFFdkNDLDJEQUFVLENBQUMsMkJBQUQsQ0FGNkIsQ0FBekM7QUFLQSxRQUFNO0FBQUUxUixRQUFJLEVBQUUyUjtBQUFSLE1BQWdDRixxREFBUSxDQUM1Qyx5QkFENEMsRUFFNUNDLDJEQUFVLENBQUMsMEJBQUQsQ0FGa0MsQ0FBOUM7QUFLQSxzQkFDRTtBQUFLLGFBQVMsRUFBRyxHQUFFdmIsMERBQU0sQ0FBQ29iLFNBQUQsQ0FBWSxvQ0FBckM7QUFBQSw0QkFDRTtBQUFLLGVBQVMsRUFBQyxtQkFBZjtBQUFBLDhCQUNFO0FBQ0UsaUJBQVMsRUFBRyxHQUFFcGIsb0VBQWlCLHlDQURqQztBQUFBLCtCQUdFO0FBQUEsb0JBQVF3YixtQkFBbUIsSUFBSUEsbUJBQW1CLENBQUNDO0FBQW5EO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFIRjtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQURGLGVBTUUsOERBQUMsa0RBQUQ7QUFBTSxZQUFJLEVBQUMsR0FBWDtBQUFBLCtCQUNFO0FBQUEsaUNBQ0U7QUFBRyxxQkFBUyxFQUFHLGVBQWN6YiwrREFBWSxFQUF6QztBQUE0QywyQkFBWTtBQUF4RDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBREY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQURGO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBTkY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQURGLGVBYUU7QUFBSyxlQUFTLEVBQUMsbUJBQWY7QUFBQSw4QkFDRTtBQUNFLGlCQUFTLEVBQUcsR0FBRUEsb0VBQWlCLHNDQURqQztBQUFBLCtCQUdFO0FBQUEsb0JBQVFxYixjQUFjLElBQUlBLGNBQWMsQ0FBQ0s7QUFBekM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUhGO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBREYsZUFNRSw4REFBQyxrREFBRDtBQUFNLFlBQUksRUFBQyxHQUFYO0FBQUEsK0JBQ0U7QUFBQSxpQ0FDRTtBQUFHLHFCQUFTLEVBQUMscUJBQWI7QUFBbUMsMkJBQVk7QUFBL0M7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQURGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFERjtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQU5GO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFiRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUFERjtBQTRCRCxDQXZDRDs7QUF5Q0EsK0RBQWVQLFdBQWYsRTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDOUNBOztBQUVBLE1BQU1RLElBQUksR0FBRyxDQUFDO0FBQUVoQixNQUFGO0FBQVF2dEIsT0FBUjtBQUFleUQ7QUFBZixDQUFELEtBQTZCO0FBQ3hDLHNCQUNFO0FBQUcsYUFBUyxFQUFDLGNBQWI7QUFBNEIsUUFBSSxFQUFDLEdBQWpDO0FBQUEsMkJBQ0UsOERBQUMsbURBQUQ7QUFDRSxTQUFHLEVBQUU4cEIsSUFEUDtBQUVFLFNBQUcsRUFBQyw0Q0FGTjtBQUdFLGVBQVMsRUFBQywrQkFIWjtBQUlFLFdBQUssRUFBRXZ0QixLQUpUO0FBS0UsWUFBTSxFQUFFeUQ7QUFMVjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBREY7QUFBQTtBQUFBO0FBQUE7QUFBQSxlQURGO0FBV0QsQ0FaRDs7QUFjQSwrREFBZThxQixJQUFmLEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoQkE7QUFDQTs7QUFFQSxNQUFNQyxFQUFFLEdBQUcsQ0FBQztBQUFFbGpCLFVBQUY7QUFBWW1qQixRQUFaO0FBQW9CQztBQUFwQixDQUFELEtBQWtDO0FBQzNDLHNCQUNFO0FBQUssYUFBUyxFQUFHLHdDQUF1QzliLDBEQUFVLEVBQWxFO0FBQUEsNEJBQ0U7QUFBTSxlQUFTLEVBQUMsa0JBQWhCO0FBQUEsZ0JBQW9DdEg7QUFBcEM7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFERixlQUVFO0FBQ0UsVUFBSSxFQUFDLE1BRFA7QUFFRSxlQUFTLEVBQUMsK0NBRlo7QUFHRSxpQkFBVyxFQUFFcWpCLDhFQUFXLENBQUNELE1BQUQsQ0FIMUI7QUFJRSxjQUFRO0FBSlY7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFGRixlQVFFO0FBQU0sZUFBUyxFQUFDLGdEQUFoQjtBQUFBLGdCQUNHRDtBQURIO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBUkY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGVBREY7QUFjRCxDQWZEOztBQWlCQSwrREFBZUQsRUFBZixFOzs7Ozs7Ozs7Ozs7Ozs7OztBQ3BCQTs7QUFFQSxNQUFNSSxTQUFTLEdBQUcsQ0FBQztBQUFFQztBQUFGLENBQUQsS0FBaUI7QUFDakMsc0JBQ0U7QUFBSyxhQUFTLEVBQUVBLE9BQWhCO0FBQUEsNEJBQ0UsOERBQUMsd0NBQUQ7QUFBSSxZQUFNLEVBQUMsS0FBWDtBQUFpQixZQUFNLEVBQUUsU0FBekI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBREYsZUFJRSw4REFBQyx3Q0FBRDtBQUFJLFlBQU0sRUFBQyxHQUFYO0FBQWUsWUFBTSxFQUFFLE1BQXZCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQUpGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxlQURGO0FBVUQsQ0FYRDs7QUFhQSwrREFBZUQsU0FBZixFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNmQTs7QUFFQSxNQUFNRSxPQUFPLEdBQUcsQ0FBQztBQUFFN0IsV0FBRjtBQUFhM2hCLFVBQWI7QUFBdUJ5akI7QUFBdkIsQ0FBRCxLQUEyQztBQUN6RCxzQkFDRTtBQUFLLGFBQVMsRUFBRyxHQUFFbmMsNERBQU0sQ0FBQ21jLFlBQUQsQ0FBZSxJQUFHbmMsNERBQU0sQ0FBQ3FhLFNBQUQsQ0FBWSxFQUE3RDtBQUFBLGNBQ0czaEI7QUFESDtBQUFBO0FBQUE7QUFBQTtBQUFBLGVBREY7QUFLRCxDQU5EOztBQVFBLCtEQUFld2pCLE9BQWYsRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNWQTtBQUNBO0FBQ0E7O0FBRUEsTUFBTUUsVUFBVSxHQUFHLENBQUM7QUFBRUMsUUFBRjtBQUFVaGQsU0FBVjtBQUFtQmlkLE1BQW5CO0FBQXlCQztBQUF6QixDQUFELEtBQTJDO0FBQzVELHNCQUNFO0FBQUksYUFBUyxFQUFHLGlEQUFoQjtBQUFBLDRCQUNFLDhEQUFDLG1EQUFEO0FBQU8sU0FBRyxFQUFFRCxJQUFaO0FBQWtCLFdBQUssRUFBRSxFQUF6QjtBQUE2QixZQUFNLEVBQUU7QUFBckM7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFERixlQUVFLDhEQUFDLGtEQUFEO0FBQU0sVUFBSSxFQUFHLEdBQUVELE1BQU8sRUFBdEI7QUFBQSw2QkFDRTtBQUFHLGlCQUFTLEVBQUMsVUFBYjtBQUFBLGtCQUF5QmhkO0FBQXpCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFERjtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQUZGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxlQURGO0FBUUQsQ0FURDs7QUFXQSwrREFBZStjLFVBQWYsRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsTUFBTUksU0FBUyxHQUFHLENBQUM7QUFBRUMsS0FBRjtBQUFPRjtBQUFQLENBQUQsS0FBeUI7QUFDekMsc0JBQ0U7QUFBSSxhQUFTLEVBQUcsR0FBRUUsR0FBSSxJQUFHemMsMEVBQU0sQ0FBQ3VjLFVBQUQsQ0FBYSxFQUE1QztBQUFBLDRCQUNFLDhEQUFDLDJEQUFEO0FBQVksWUFBTSxFQUFDLE9BQW5CO0FBQTJCLGFBQU8sRUFBQywwQkFBbkM7QUFBMEMsVUFBSSxFQUFFRyxtREFBRUE7QUFBbEQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFERixlQUVFLDhEQUFDLDJEQUFEO0FBQVksWUFBTSxFQUFDLEdBQW5CO0FBQXVCLGFBQU8sRUFBQyxxRUFBL0I7QUFBOEMsVUFBSSxFQUFFQyxxREFBSUE7QUFBeEQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFGRixlQUdFLDhEQUFDLDJEQUFEO0FBQVksWUFBTSxFQUFDLEdBQW5CO0FBQXVCLGFBQU8sRUFBQywwQkFBL0I7QUFBc0MsVUFBSSxFQUFFQyxxREFBSUE7QUFBaEQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFIRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUFERjtBQU9ELENBUkQ7O0FBVUEsK0RBQWVKLFNBQWYsRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaEJBO0FBQ0E7QUFFQTs7QUFDQSxNQUFNSyxTQUFTLEdBQUcsQ0FBQztBQUNqQnZDLGNBRGlCO0FBRWpCd0MsU0FGaUI7QUFHakJuRCxvQkFIaUI7QUFJakJFLGdCQUppQjtBQUtqQk07QUFMaUIsQ0FBRCxLQU1aO0FBQ0osTUFBSTRDLEtBQUo7O0FBRUEsUUFBTUMsYUFBYSxHQUFJcG1CLENBQUQsSUFBTztBQUMzQnVFLGdCQUFZLENBQUM0aEIsS0FBRCxDQUFaO0FBQ0EsUUFBSTNkLElBQUksR0FBR3hJLENBQUMsQ0FBQ1QsTUFBRixDQUFTOEYsS0FBcEI7O0FBRUEsUUFBSW1ELElBQUksSUFBSUEsSUFBSSxDQUFDNmQsSUFBTCxFQUFaLEVBQXlCO0FBQ3ZCRixXQUFLLEdBQUdsaUIsVUFBVSxDQUFDLFlBQVk7QUFDN0IsY0FBTXFpQixTQUFTLEdBQUcsTUFBTWhlLEtBQUssQ0FDMUIsR0FBRStYLHVEQUFTLDBCQUF5QjdYLElBQUssRUFEZixDQUE3Qjs7QUFJQSxZQUFJOGQsU0FBUyxDQUFDdlQsTUFBVixLQUFxQixHQUF6QixFQUE4QjtBQUM1QixnQkFBTXdULGFBQWEsR0FBRyxNQUFNRCxTQUFTLENBQUN0VCxJQUFWLEVBQTVCO0FBQ0F1USx1QkFBYSxDQUFDZ0QsYUFBRCxDQUFiOztBQUNBLGNBQUlMLE9BQUosRUFBYTtBQUNYeEMsd0JBQVksQ0FBQyxXQUFELENBQVo7QUFDRCxXQUZELE1BRU87QUFDTFgsOEJBQWtCLENBQUMsUUFBRCxDQUFsQjtBQUNBVyx3QkFBWSxDQUFFOEMsSUFBRCxJQUFVO0FBQ3JCLGtCQUFJQSxJQUFJLEtBQUssRUFBYixFQUFpQjtBQUNmQSxvQkFBSSxHQUFHLG1CQUFQO0FBRUF2RCw4QkFBYyxDQUFDLFFBQUQsQ0FBZDtBQUVBLHVCQUFPdUQsSUFBUDtBQUNELGVBTkQsTUFNTztBQUNMLHVCQUFPQSxJQUFQO0FBQ0Q7QUFDRixhQVZXLENBQVo7QUFXRDtBQUNGO0FBQ0YsT0F6QmlCLEVBeUJmLElBekJlLENBQWxCO0FBMEJELEtBM0JELE1BMkJPO0FBQ0xqRCxtQkFBYSxDQUFDLEVBQUQsQ0FBYjtBQUNEO0FBQ0YsR0FsQ0Q7O0FBb0NBLHNCQUNFO0FBQ0UsYUFBUyxFQUFHLDhCQUNWMkMsT0FBTyxHQUFHOWMsd0VBQUgsR0FBc0JBLDZFQUM5QixFQUhIO0FBQUEsNEJBS0U7QUFDRSxlQUFTLEVBQUcsNkJBQ1Y4YyxPQUFPLEdBQUc5YywwRUFBSCxHQUF3QkEsK0VBQ2hDLEVBSEg7QUFBQSw2QkFLRTtBQUFHLGlCQUFTLEVBQUMsY0FBYjtBQUE0Qix1QkFBWTtBQUF4QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBTEY7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFMRixlQVlFO0FBQ0UsZUFBUyxFQUFHLHlCQUF3QkEsMkVBQW9CLEVBRDFEO0FBRUUsVUFBSSxFQUFDLE1BRlA7QUFHRSxpQkFBVyxFQUFDLDRGQUhkO0FBSUUsY0FBUSxFQUFFZ2QsYUFKWjtBQUtFLGtCQUFZLEVBQUM7QUFMZjtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQVpGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxlQURGO0FBc0JELENBbkVEOztBQXFFQSw0RUFBZWpELGlEQUFBLENBQVc4QyxTQUFYLENBQWYsRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN6RUE7QUFDQTs7QUFFQSxNQUFNUSxJQUFJLEdBQUcsQ0FBQztBQUFFQyxlQUFGO0FBQWlCL0Y7QUFBakIsQ0FBRCxLQUE2QjtBQUN4QyxzQkFDRTtBQUFLLGFBQVMsRUFBRyxHQUFFdlgseURBQU0sQ0FBQ3NkLGFBQUQsQ0FBZ0IsRUFBekM7QUFBQSw0QkFDRTtBQUFBLDZCQUNFO0FBQUEsK0JBQ0UsOERBQUMsa0RBQUQ7QUFBTSxjQUFJLEVBQUMsR0FBWDtBQUFBLGlDQUNFO0FBQUEsbUNBQ0U7QUFDRSxpQkFBRyxFQUFDLDR0S0FETjtBQUVFLGlCQUFHLEVBQUM7QUFGTjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBREY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQURGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFERjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBREY7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFERixlQWFFO0FBQUEsZ0JBQU8vRixJQUFJLElBQUlBLElBQUksQ0FBQzBCO0FBQXBCO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBYkY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGVBREY7QUFpQkQsQ0FsQkQ7O0FBb0JBLCtEQUFlb0UsSUFBZixFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdkJBO0FBQ0E7QUFDQTs7QUFFQSxNQUFNRSxPQUFPLEdBQUcsQ0FBQztBQUFFQyxTQUFGO0FBQVcvakIsTUFBWDtBQUFpQmdrQjtBQUFqQixDQUFELEtBQXVDO0FBQ3JELE1BQUlwZSxPQUFPLEdBQUc1RixJQUFJLEtBQUssSUFBVCxHQUFnQixTQUFoQixHQUE0QixjQUExQztBQUVBLE1BQUltTyxNQUFNLEdBQ1I0VixPQUFPLElBQ1BBLE9BQU8sQ0FBQ2x2QixHQUFSLENBQWEwcUIsR0FBRCxJQUFTO0FBQ25CLFFBQUl4UyxHQUFHLEdBQUksR0FBRS9NLElBQUssSUFBR3VmLEdBQUcsQ0FBQzlkLEVBQUcsRUFBNUI7QUFFQSx3QkFDRTtBQUFJLGVBQVMsRUFBQyxpQkFBZDtBQUFBLDhCQUNFLDhEQUFDLHVFQUFEO0FBQWtCLGFBQUssRUFBRThkLEdBQUcsQ0FBQzBFO0FBQTdCO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBREYsZUFFRSw4REFBQyxrREFBRDtBQUFNLFlBQUksRUFBQyxHQUFYO0FBQUEsK0JBQ0U7QUFBQSxvQkFBSTFFLEdBQUcsQ0FBQzJFO0FBQVI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQURGO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBRkY7QUFBQSxPQUFxQzNFLEdBQUcsQ0FBQzlkLEVBQXpDO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBREY7QUFRRCxHQVhELENBRkY7QUFlQSxzQkFDRTtBQUFBLDRCQUNFO0FBQUksZUFBUyxFQUFHLGlCQUFnQjhFLDBFQUFxQixFQUFyRDtBQUFBLGdHQUNrQlgsT0FEbEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQURGLEVBSUdtZSxPQUFPLElBQUlBLE9BQU8sQ0FBQzN2QixNQUFuQixnQkFDQztBQUFJLGVBQVMsRUFBRyxHQUFFNHZCLGNBQWUsSUFBR3pkLHdFQUFtQixFQUF2RDtBQUFBLGdCQUEyRDRIO0FBQTNEO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBREQsZ0JBR0M7QUFDRSxlQUFTLEVBQUMsMkJBRFo7QUFFRSxXQUFLLEVBQUU7QUFDTGdXLG1CQUFXLEVBQUUsS0FEUjtBQUVMQyxvQkFBWSxFQUFFLEdBRlQ7QUFHTEMscUJBQWEsRUFBRTtBQUhWLE9BRlQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBUEo7QUFBQSxrQkFERjtBQXFCRCxDQXZDRDs7QUF5Q0EsK0RBQWVQLE9BQWYsRTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3Q0E7O0FBRUEsTUFBTVEsZUFBZSxHQUFHLENBQUM7QUFBRTNELFlBQUY7QUFBY3FEO0FBQWQsQ0FBRCxLQUFvQztBQUMxRCxzQkFDRTtBQUFLLE1BQUUsRUFBQyxrQkFBUjtBQUFBLDRCQUNFLDhEQUFDLHFEQUFEO0FBQ0UsYUFBTyxFQUFFckQsVUFBVSxDQUFDNEQsR0FEdEI7QUFFRSxVQUFJLEVBQUMsSUFGUDtBQUdFLG9CQUFjLEVBQUVQO0FBSGxCO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBREYsZUFNRSw4REFBQyxxREFBRDtBQUNFLGFBQU8sRUFBRXJELFVBQVUsQ0FBQzZELFNBRHRCO0FBRUUsVUFBSSxFQUFDLFdBRlA7QUFHRSxvQkFBYyxFQUFFUjtBQUhsQjtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQU5GO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxlQURGO0FBY0QsQ0FmRDs7QUFpQkEsK0RBQWVNLGVBQWYsRTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuQkEsTUFBTUcsZ0JBQWdCLEdBQUcsQ0FBQztBQUFFQztBQUFGLENBQUQsS0FBZTtBQUN0QyxNQUFJQyxLQUFLLEdBQUcsRUFBWjs7QUFFQSxPQUFLLElBQUlydkIsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR292QixLQUFLLEdBQUcsQ0FBNUIsRUFBK0JwdkIsQ0FBQyxFQUFoQyxFQUFvQztBQUNsQ3F2QixTQUFLLENBQUN6d0IsSUFBTixlQUNFO0FBQ0UsZUFBUyxFQUFDLFlBRFo7QUFFRSxXQUFLLEVBQUU7QUFBRTB3QixhQUFLLEVBQUU7QUFBVCxPQUZUO0FBR0UscUJBQVk7QUFIZCxPQUlPdHZCLENBSlA7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFERjtBQVFEOztBQUVELHNCQUFPO0FBQU0sU0FBSyxFQUFFO0FBQUV1dkIsZ0JBQVUsRUFBRTtBQUFkLEtBQWI7QUFBQSxjQUFzQ0Y7QUFBdEM7QUFBQTtBQUFBO0FBQUE7QUFBQSxlQUFQO0FBQ0QsQ0FmRDs7QUFpQkEsK0RBQWVGLGdCQUFmLEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxNQUFNSyxRQUFRLEdBQUcsQ0FBQztBQUFFNUc7QUFBRixDQUFELEtBQWdCO0FBQy9CLE1BQUk2RyxVQUFVLEdBQ1o3RyxNQUFNLElBQ05BLE1BQU0sQ0FBQzlwQixNQURQLElBRUE4cEIsTUFBTSxDQUFDcnBCLEdBQVAsQ0FBWTBxQixHQUFELElBQVM7QUFDbEIsd0JBQU8sOERBQUMsOENBQUQ7QUFBVSxjQUFRLEVBQUVBLEdBQUcsQ0FBQ0QsSUFBeEI7QUFBOEIsWUFBTSxFQUFFQyxHQUFHLENBQUM5ZDtBQUExQztBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQUFQO0FBQ0QsR0FGRCxDQUhGO0FBT0Esc0JBQ0U7QUFBSyxhQUFTLEVBQUcsbUJBQWtCOEUsc0VBQWdCLEVBQW5EO0FBQUEsNEJBQ0UsOERBQUMsK0RBQUQ7QUFBYyxVQUFJLEVBQUU7QUFBcEI7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFERixlQUVFLDhEQUFDLGlFQUFEO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBRkYsZUFHRTtBQUNFLGVBQVMsRUFBQywyQ0FEWjtBQUVFLFVBQUksRUFBQyxRQUZQO0FBR0UsUUFBRSxFQUFDLGdCQUhMO0FBSUUsd0JBQWUsVUFKakI7QUFLRSx1QkFBYyxPQUxoQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFIRixlQVlFO0FBQUksZUFBUyxFQUFDLDBCQUFkO0FBQXlDLHlCQUFnQixnQkFBekQ7QUFBQSxnQkFDR3dlO0FBREg7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFaRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUFERjtBQWtCRCxDQTFCRDs7QUE0QkEsK0RBQWVELFFBQWYsRTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDakNBOztBQUVBLE1BQU1FLFFBQVEsR0FBRyxDQUFDO0FBQUVDLFVBQUY7QUFBWUM7QUFBWixDQUFELEtBQTBCO0FBQ3pDLFFBQU07QUFBRWxHO0FBQUYsTUFBbUJDLCtEQUFhLEVBQXRDOztBQUVBLFFBQU1rRyxVQUFVLEdBQUlob0IsQ0FBRCxJQUFPO0FBQ3hCNmhCLGdCQUFZLENBQUM7QUFBRWhmLFVBQUksRUFBRSxZQUFSO0FBQXNCNGUsYUFBTyxFQUFFO0FBQUVuZCxVQUFFLEVBQUV0RSxDQUFDLENBQUNULE1BQUYsQ0FBUzhGO0FBQWY7QUFBL0IsS0FBRCxDQUFaO0FBQ0QsR0FGRDs7QUFJQSxzQkFDRTtBQUFJLGFBQVMsRUFBQyxtREFBZDtBQUFBLDRCQUNFO0FBQU0sZUFBUyxFQUFDLGVBQWhCO0FBQUEsZ0JBQWlDeWlCO0FBQWpDO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBREYsZUFFRTtBQUNFLFVBQUksRUFBQyxRQURQO0FBRUUsZUFBUyxFQUFDLGtCQUZaO0FBR0Usb0JBQVcsT0FIYjtBQUlFLFdBQUssRUFBRUMsTUFKVDtBQUtFLGFBQU8sRUFBRy9uQixDQUFELElBQU9nb0IsVUFBVSxDQUFDaG9CLENBQUQ7QUFMNUI7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFGRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUFERjtBQVlELENBbkJEOztBQXFCQSwrREFBZTZuQixRQUFmLEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsTUFBTUksSUFBSSxHQUFHLENBQUM7QUFBRUMsWUFBRjtBQUFjQztBQUFkLENBQUQsS0FBNkI7QUFDeEMsUUFBTTtBQUFFQyxhQUFGO0FBQWFuVjtBQUFiLE1BQXNCeVIscURBQVEsQ0FDbEMsQ0FBQyxRQUFELEVBQVd3RCxVQUFYLENBRGtDLEVBRWxDdkQsMkRBQVUsQ0FBRSxxQkFBb0J1RCxVQUFXLEVBQWpDLENBRndCLEVBR2xDO0FBQ0VHLFdBQU8sRUFBRSxDQUFDLENBQUNIO0FBRGIsR0FIa0MsQ0FBcEM7QUFRQSxRQUFNO0FBQUVuSDtBQUFGLE1BQWFlLCtEQUFhLEVBQWhDOztBQUVBLFFBQU13RyxPQUFPLEdBQUl0b0IsQ0FBRCxJQUFPO0FBQ3JCLFFBQUl1b0IsUUFBUSxHQUFHamQsS0FBSyxDQUFDNFIsSUFBTixDQUFXbGQsQ0FBQyxDQUFDVCxNQUFGLENBQVNOLE9BQXBCLEVBQTZCM0gsTUFBN0IsQ0FDWmt4QixNQUFELElBQVlBLE1BQU0sQ0FBQ0QsUUFETixDQUFmO0FBSUFKLFdBQU8sQ0FBQztBQUFFaEcsVUFBSSxFQUFFb0csUUFBUSxDQUFDLENBQUQsQ0FBUixDQUFZRSxPQUFaLENBQW9CcGpCLEtBQTVCO0FBQW1DZixRQUFFLEVBQUVpa0IsUUFBUSxDQUFDLENBQUQsQ0FBUixDQUFZbGpCO0FBQW5ELEtBQUQsQ0FBUDtBQUNELEdBTkQ7O0FBUUEsTUFBSXFqQixZQUFZLEdBQ2R6VixJQUFJLElBQ0pBLElBQUksQ0FBQzBWLE1BREwsSUFFQTFWLElBQUksQ0FBQzBWLE1BQUwsQ0FBWTF4QixNQUZaLElBR0FnSyxtREFBQSxDQUFRZ1MsSUFBSSxDQUFDMFYsTUFBYixFQUFxQjVILE1BQXJCLEVBQTZCLElBQTdCLEVBQW1DcnBCLEdBQW5DLENBQXdDMHFCLEdBQUQsSUFBUztBQUM5Qyx3QkFDRTtBQUFxQixXQUFLLEVBQUVBLEdBQUcsQ0FBQzlkLEVBQWhDO0FBQW9DLG9CQUFZOGQsR0FBRyxDQUFDRCxJQUFwRDtBQUFBLGdCQUNHQyxHQUFHLENBQUNEO0FBRFAsT0FBYUMsR0FBRyxDQUFDOWQsRUFBakI7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFERjtBQUtELEdBTkQsQ0FKRjs7QUFZQSxNQUFJOGpCLFNBQUosRUFBZTtBQUNiLHdCQUNFLDhEQUFDLHNEQUFEO0FBQWMsVUFBSSxFQUFDLFNBQW5CO0FBQTZCLFdBQUssRUFBQyxTQUFuQztBQUE2QyxZQUFNLEVBQUUsRUFBckQ7QUFBeUQsV0FBSyxFQUFFO0FBQWhFO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBREY7QUFHRCxHQUpELE1BSU87QUFDTCx3QkFDRTtBQUFRLGVBQVMsRUFBQyxhQUFsQjtBQUFnQyxjQUFRLEVBQUdwb0IsQ0FBRCxJQUFPc29CLE9BQU8sQ0FBQ3RvQixDQUFELENBQXhEO0FBQUEsOEJBQ0U7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBREYsRUFFRzBvQixZQUZIO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFERjtBQU1EO0FBQ0YsQ0EzQ0Q7O0FBNkNBLCtEQUFlVCxJQUFmLEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbkRBO0FBQ0E7QUFDQTs7QUFFQSxNQUFNVyxRQUFRLEdBQUcsTUFBTTtBQUNyQixzQkFDRTtBQUNFLGFBQVMsRUFBRyw2Q0FBNEN4ZixzRUFBZ0IsRUFEMUU7QUFBQSw0QkFHRSw4REFBQywrREFBRDtBQUFjLFVBQUksRUFBRTtBQUFwQjtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQUhGLGVBSUUsOERBQUMsaUVBQUQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFKRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUFERjtBQVFELENBVEQ7O0FBV0EsK0RBQWV3ZixRQUFmLEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDZkE7QUFDQTs7QUFFQSxNQUFNQyxZQUFZLEdBQUcsQ0FBQztBQUFFcmdCO0FBQUYsQ0FBRCxLQUFjO0FBQ2pDLFFBQU07QUFBQSxPQUFDa2QsSUFBRDtBQUFBLE9BQU9vRDtBQUFQLE1BQWtCaGQsK0NBQVEsQ0FBQyxrQkFBRCxDQUFoQztBQUVBLFFBQU07QUFBRWlWO0FBQUYsTUFBYWUsK0RBQWEsRUFBaEM7QUFFQXhmLGtEQUFTLENBQUMsTUFBTTtBQUNkLFFBQUl5ZSxNQUFNLENBQUM5cEIsTUFBWCxFQUFtQjtBQUNqQjZ4QixhQUFPLENBQUMsYUFBRCxDQUFQO0FBQ0QsS0FGRCxNQUVPO0FBQ0xBLGFBQU8sQ0FBQyxrQkFBRCxDQUFQO0FBQ0Q7QUFDRixHQU5RLEVBTU4sQ0FBQy9ILE1BQUQsQ0FOTSxDQUFUO0FBUUEsc0JBQ0U7QUFBSyxhQUFTLEVBQUMsUUFBZjtBQUFBLDRCQUNFO0FBQ0UsVUFBSSxFQUFDLFFBRFA7QUFFRSx3QkFBZSxPQUZqQjtBQUdFLHdCQUFlLGdCQUhqQjtBQUlFLGVBQVMsRUFBQyxVQUpaO0FBQUEsNkJBTUU7QUFBRyxpQkFBUyxFQUFFMkUsSUFBZDtBQUFvQix1QkFBWTtBQUFoQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBTkY7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFERixFQVNHbGQsSUFBSSxpQkFDSDtBQUFHLGVBQVMsRUFBQyw2QkFBYjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFWSjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUFERjtBQWVELENBNUJEOztBQThCQSwrREFBZXFnQixZQUFmLEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsTUFBTUUsYUFBYSxHQUFHLE1BQU07QUFDMUIsUUFBTTtBQUFBLE9BQUNDLFFBQUQ7QUFBQSxPQUFXQztBQUFYLE1BQTBCbmQsK0NBQVEsQ0FBQyxJQUFELENBQXhDO0FBQ0EsUUFBTTtBQUFBLE9BQUNxVyxJQUFEO0FBQUEsT0FBT2dHO0FBQVAsTUFBa0JyYywrQ0FBUSxDQUFDLElBQUQsQ0FBaEM7QUFFQSxRQUFNO0FBQUUrVjtBQUFGLE1BQW1CQywrREFBYSxFQUF0QztBQUVBeGYsa0RBQVMsQ0FBQyxNQUFNO0FBQ2QsYUFBUzRtQixNQUFULENBQWdCbHBCLENBQWhCLEVBQW1CO0FBQ2pCLFVBQUlULE1BQU0sR0FBR1MsQ0FBQyxDQUFDVCxNQUFGLENBQVNxa0IsT0FBVCxDQUFpQixnQkFBakIsQ0FBYjs7QUFFQSxVQUFJLENBQUNya0IsTUFBTCxFQUFhO0FBQ1gwcEIsbUJBQVcsQ0FBQyxJQUFELENBQVg7QUFDQWQsZUFBTyxDQUFDLElBQUQsQ0FBUDtBQUNELE9BSEQsTUFHTztBQUNSOztBQUVEM2lCLFlBQVEsQ0FBQ3FlLGdCQUFULENBQTBCLE9BQTFCLEVBQW1DcUYsTUFBbkM7QUFFQSxXQUFPLE1BQU0xakIsUUFBUSxDQUFDc2UsbUJBQVQsQ0FBNkIsT0FBN0IsRUFBc0NvRixNQUF0QyxDQUFiO0FBQ0QsR0FiUSxFQWFOLEVBYk0sQ0FBVDs7QUFlQSxRQUFNQyxZQUFZLEdBQUcsTUFBTTtBQUN6QnRILGdCQUFZLENBQUM7QUFDWGhmLFVBQUksRUFBRSxTQURLO0FBRVg0ZSxhQUFPLEVBQUU7QUFBRW5kLFVBQUUsRUFBRTZkLElBQUksQ0FBQzdkLEVBQVg7QUFBZTZkLFlBQUksRUFBRUEsSUFBSSxDQUFDQTtBQUExQjtBQUZFLEtBQUQsQ0FBWjtBQUlELEdBTEQ7O0FBT0EsUUFBTWlILFVBQVUsR0FBRyxNQUFNO0FBQ3ZCSCxlQUFXLENBQUMsSUFBRCxDQUFYO0FBQ0FkLFdBQU8sQ0FBQyxJQUFELENBQVA7QUFDRCxHQUhEOztBQUtBLHNCQUNFO0FBQ0UsYUFBUyxFQUFDLFlBRFo7QUFFRSxNQUFFLEVBQUMsZUFGTDtBQUdFLFlBQVEsRUFBQyxJQUhYO0FBSUUsdUJBQWdCLG9CQUpsQjtBQUtFLG1CQUFZLE1BTGQ7QUFBQSwyQkFPRTtBQUFLLGVBQVMsRUFBQyxjQUFmO0FBQUEsNkJBQ0U7QUFBSyxpQkFBUyxFQUFDLGVBQWY7QUFBQSxnQ0FDRTtBQUFLLG1CQUFTLEVBQUMsY0FBZjtBQUFBLGtDQUNFO0FBQUkscUJBQVMsRUFBQyxhQUFkO0FBQTRCLGNBQUUsRUFBQyxvQkFBL0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsdUJBREYsZUFJRTtBQUNFLGdCQUFJLEVBQUMsUUFEUDtBQUVFLHFCQUFTLEVBQUMsV0FGWjtBQUdFLCtCQUFnQixPQUhsQjtBQUlFLDBCQUFXLE9BSmI7QUFLRSxtQkFBTyxFQUFFaUI7QUFMWDtBQUFBO0FBQUE7QUFBQTtBQUFBLHVCQUpGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxxQkFERixlQWFFO0FBQUssbUJBQVMsRUFBQywwQ0FBZjtBQUFBLG9CQUNHSixRQUFRLGdCQUNQLDhEQUFDLCtDQUFEO0FBQU0sc0JBQVUsRUFBRUEsUUFBbEI7QUFBNEIsbUJBQU8sRUFBRWI7QUFBckM7QUFBQTtBQUFBO0FBQUE7QUFBQSx1QkFETyxnQkFHUCw4REFBQyx1REFBRDtBQUFVLHVCQUFXLEVBQUVjO0FBQXZCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFKSjtBQUFBO0FBQUE7QUFBQTtBQUFBLHFCQWJGLGVBb0JFO0FBQUssbUJBQVMsRUFBQyxjQUFmO0FBQUEsaUNBQ0U7QUFDRSxnQkFBSSxFQUFDLFFBRFA7QUFFRSxxQkFBUyxFQUFDLGlCQUZaO0FBR0UsK0JBQWdCLE9BSGxCO0FBSUUsbUJBQU8sRUFBRUUsWUFKWDtBQUtFLG9CQUFRLEVBQUVILFFBQVEsR0FBRyxLQUFILEdBQVcsSUFML0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFERjtBQUFBO0FBQUE7QUFBQTtBQUFBLHFCQXBCRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFERjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBUEY7QUFBQTtBQUFBO0FBQUE7QUFBQSxlQURGO0FBNENELENBN0VEOztBQStFQSwrREFBZUQsYUFBZixFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcEZBO0FBQ0E7QUFDQTs7QUFFQSxNQUFNTSxRQUFRLEdBQUcsQ0FBQztBQUFFSjtBQUFGLENBQUQsS0FBcUI7QUFDcEMsUUFBTTtBQUFFYixhQUFGO0FBQWFuVjtBQUFiLE1BQXNCeVIscURBQVEsQ0FDbEMsV0FEa0MsRUFFbENDLDJEQUFVLENBQUMsc0JBQUQsQ0FGd0IsQ0FBcEM7O0FBS0EsUUFBTTJFLGNBQWMsR0FBSXRwQixDQUFELElBQU87QUFDNUJpcEIsZUFBVyxDQUFDanBCLENBQUMsQ0FBQ1QsTUFBRixDQUFTOEYsS0FBVixDQUFYO0FBQ0QsR0FGRDs7QUFJQSxNQUFJa2tCLFNBQVMsR0FDWHRXLElBQUksSUFDSkEsSUFBSSxDQUFDaGMsTUFETCxJQUVBZ2MsSUFBSSxDQUFDdmIsR0FBTCxDQUFVMHFCLEdBQUQsSUFBUztBQUNoQix3QkFDRTtBQUFxQixXQUFLLEVBQUVBLEdBQUcsQ0FBQzlkLEVBQWhDO0FBQUEsZ0JBQ0c4ZCxHQUFHLENBQUM0RztBQURQLE9BQWE1RyxHQUFHLENBQUM5ZCxFQUFqQjtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQURGO0FBS0QsR0FORCxDQUhGOztBQVdBLE1BQUk4akIsU0FBSixFQUFlO0FBQ2Isd0JBQ0UsOERBQUMsc0RBQUQ7QUFBYyxVQUFJLEVBQUMsU0FBbkI7QUFBNkIsV0FBSyxFQUFDLFNBQW5DO0FBQTZDLFlBQU0sRUFBRSxFQUFyRDtBQUF5RCxXQUFLLEVBQUU7QUFBaEU7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFERjtBQUdELEdBSkQsTUFJTztBQUNMLHdCQUNFO0FBQVEsZUFBUyxFQUFDLGFBQWxCO0FBQWdDLGNBQVEsRUFBR3BvQixDQUFELElBQU9zcEIsY0FBYyxDQUFDdHBCLENBQUQsQ0FBL0Q7QUFBQSw4QkFDRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFERixFQUVHdXBCLFNBRkg7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQURGO0FBTUQ7QUFDRixDQWpDRDs7QUFtQ0EsK0RBQWVGLFFBQWYsRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxNQUFNRyxpQkFBaUIsR0FBRyxNQUFNO0FBQzlCLFFBQU07QUFBQSxPQUFDQyxVQUFEO0FBQUEsT0FBYUM7QUFBYixNQUE4QjVkLCtDQUFRLENBQUMsS0FBRCxDQUE1QztBQUNBLFFBQU07QUFBRWlWO0FBQUYsTUFBYWUsK0RBQWEsRUFBaEM7QUFFQXhmLGtEQUFTLENBQUMsTUFBTTtBQUNkLFFBQUl5ZSxNQUFNLENBQUM5cEIsTUFBWCxFQUFtQjtBQUNqQnl5QixtQkFBYSxDQUFDLElBQUQsQ0FBYjtBQUNELEtBRkQsTUFFTztBQUNMQSxtQkFBYSxDQUFDLEtBQUQsQ0FBYjtBQUNEO0FBQ0YsR0FOUSxFQU1OLENBQUMzSSxNQUFELENBTk0sQ0FBVDtBQVFBLHNCQUNFO0FBQUssYUFBUyxFQUFDLDJCQUFmO0FBQUEsMkJBQ0U7QUFBSyxlQUFTLEVBQUMsd0ZBQWY7QUFBQSw4QkFDRSw4REFBQywrQ0FBRDtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQURGLEVBRUcwSSxVQUFVLGdCQUFHLDhEQUFDLGdFQUFEO0FBQVUsY0FBTSxFQUFFMUk7QUFBbEI7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFBSCxnQkFBa0MsOERBQUMsdURBQUQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFGL0M7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBREY7QUFBQTtBQUFBO0FBQUE7QUFBQSxlQURGO0FBUUQsQ0FwQkQ7O0FBc0JBLCtEQUFleUksaUJBQWYsRTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDNUJBOztBQUNBLE1BQU1HLElBQUksR0FBRyxNQUFNO0FBQ2pCLFFBQU1DLFdBQVcsR0FBSTdDLEtBQUQsSUFBVztBQUM3QixZQUFRQSxLQUFSO0FBQ0UsV0FBSyxNQUFMO0FBQ0UsZUFBTyxNQUFQOztBQUVGLFdBQUssTUFBTDtBQUNFLGVBQU8sS0FBUDs7QUFFRjtBQUNFLGVBQU9BLEtBQVA7QUFSSjtBQVVELEdBWEQ7O0FBYUEsc0JBQ0UsOERBQUMsMkRBQUQ7QUFDRSxhQUFTLEVBQUMsTUFEWjtBQUVFLGtCQUFjLEVBQUU2QyxXQUZsQjtBQUdFLGlCQUFhLEVBQUMsZ0JBSGhCO0FBSUUseUJBQXFCLEVBQUMsaUJBSnhCO0FBS0UsdUJBQW1CLEVBQUM7QUFMdEI7QUFBQTtBQUFBO0FBQUE7QUFBQSxlQURGO0FBU0QsQ0F2QkQ7O0FBeUJBLCtEQUFlRCxJQUFmLEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzFCQTtBQUNBOztBQUVBLE1BQU1FLGtCQUFrQixHQUFHLENBQUM7QUFBRUM7QUFBRixDQUFELEtBQXFCO0FBQzlDLFFBQU05cUIsTUFBTSxHQUFHeUMsc0RBQVMsRUFBeEI7O0FBRUEsTUFBSXFvQixXQUFKLEVBQWlCO0FBQ2Ysd0JBQ0U7QUFBQSw4QkFDRTtBQUFRLGlCQUFTLEVBQUcsR0FBRTFnQiw4RUFBd0IsRUFBOUM7QUFBaUQsWUFBSSxFQUFDLFFBQXREO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQURGLGVBSUU7QUFBUSxpQkFBUyxFQUFHLEdBQUVBLDhFQUF3QixFQUE5QztBQUFpRCxZQUFJLEVBQUMsUUFBdEQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBSkY7QUFBQSxvQkFERjtBQVVELEdBWEQsTUFXTztBQUNMLHdCQUNFO0FBQUEsOEJBQ0U7QUFDRSxpQkFBUyxFQUFHLHlDQUF3Q0EsNkVBQXVCLEVBRDdFO0FBQUEsZ0NBR0U7QUFBRyxtQkFBUyxFQUFDLG9CQUFiO0FBQWtDLHlCQUFZO0FBQTlDO0FBQUE7QUFBQTtBQUFBO0FBQUEscUJBSEYsZUFJRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxxQkFKRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBREYsZUFPRTtBQUNFLGlCQUFTLEVBQUcsOENBQTZDQSw2RUFBdUIsRUFEbEY7QUFBQSxnQ0FHRTtBQUFHLG1CQUFTLEVBQUMsa0JBQWI7QUFBZ0MseUJBQVk7QUFBNUM7QUFBQTtBQUFBO0FBQUE7QUFBQSxxQkFIRixlQUlFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHFCQUpGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFQRjtBQUFBLG9CQURGO0FBZ0JEO0FBQ0YsQ0FoQ0Q7O0FBa0NBLCtEQUFleWdCLGtCQUFmLEU7Ozs7Ozs7Ozs7OztBQ3JDQSxTQUFTMUUsV0FBVCxDQUFxQjRFLEdBQXJCLEVBQTBCO0FBQ3hCLE1BQUlBLEdBQUcsR0FBRyxJQUFWLEVBQWdCO0FBQ2QsV0FBT0EsR0FBUDtBQUNEOztBQUNELE1BQUlDLEVBQUUsR0FBRyxDQUNQO0FBQUVsaUIsS0FBQyxFQUFFLEdBQUw7QUFBVXZRLEtBQUMsRUFBRTtBQUFiLEdBRE8sRUFFUDtBQUFFdVEsS0FBQyxFQUFFLEdBQUw7QUFBVXZRLEtBQUMsRUFBRTtBQUFiLEdBRk8sRUFHUDtBQUFFdVEsS0FBQyxFQUFFLEdBQUw7QUFBVXZRLEtBQUMsRUFBRTtBQUFiLEdBSE8sRUFJUDtBQUFFdVEsS0FBQyxFQUFFLElBQUw7QUFBV3ZRLEtBQUMsRUFBRTtBQUFkLEdBSk8sRUFLUDtBQUFFdVEsS0FBQyxFQUFFLElBQUw7QUFBV3ZRLEtBQUMsRUFBRTtBQUFkLEdBTE8sRUFNUDtBQUFFdVEsS0FBQyxFQUFFLElBQUw7QUFBV3ZRLEtBQUMsRUFBRTtBQUFkLEdBTk8sQ0FBVDtBQVFBLE1BQUlZLENBQUo7O0FBQ0EsT0FBS0EsQ0FBQyxHQUFHNnhCLEVBQUUsQ0FBQy95QixNQUFILEdBQVksQ0FBckIsRUFBd0JrQixDQUFDLEdBQUcsQ0FBNUIsRUFBK0JBLENBQUMsRUFBaEMsRUFBb0M7QUFDbEMsUUFBSTR4QixHQUFHLElBQUlDLEVBQUUsQ0FBQzd4QixDQUFELENBQUYsQ0FBTTJQLENBQWpCLEVBQW9CO0FBQ2xCO0FBQ0Q7QUFDRjs7QUFDRCxTQUNFLENBQUNpaUIsR0FBRyxHQUFHQyxFQUFFLENBQUM3eEIsQ0FBRCxDQUFGLENBQU0yUCxDQUFiLEVBQWdCbWlCLE9BQWhCLENBQXdCLENBQXhCLEVBQTJCaHFCLE9BQTNCLENBQW1DLDBCQUFuQyxFQUErRCxJQUEvRCxJQUNBK3BCLEVBQUUsQ0FBQzd4QixDQUFELENBQUYsQ0FBTVosQ0FGUjtBQUlEOztBQUVELCtEQUFlNHRCLFdBQWYsRTs7Ozs7Ozs7OztBQ3hCQSxNQUFNO0FBQUU5RTtBQUFGLElBQWV4c0IsbUJBQU8sQ0FBQyx5REFBRCxDQUE1Qjs7QUFFQSxNQUFNOHdCLFVBQVUsR0FBSS9VLEdBQUQsSUFBUztBQUMxQixTQUFPLFlBQVk7QUFDakIsVUFBTXFELElBQUksR0FBRyxNQUFNM0ssS0FBSyxDQUFDK1gsUUFBUSxHQUFHelEsR0FBWixFQUFpQjtBQUN2Q3lHLFlBQU0sRUFBRSxLQUQrQjtBQUV2Q3ZELGlCQUFXLEVBQUU7QUFGMEIsS0FBakIsQ0FBeEI7QUFLQSxVQUFNb1gsWUFBWSxHQUFHLE1BQU1qWCxJQUFJLENBQUNELElBQUwsRUFBM0I7QUFDQSxXQUFPa1gsWUFBUDtBQUNELEdBUkQ7QUFTRCxDQVZEOztBQVlBbkksTUFBTSxDQUFDanVCLE9BQVAsR0FBaUI2d0IsVUFBakIsQzs7Ozs7Ozs7Ozs7O0FDZEEsK0RBQWdCLENBQUMsa0dBQWtHLEU7Ozs7Ozs7Ozs7OztBQ0FuSCwrREFBZ0IsQ0FBQyxvR0FBb0csRTs7Ozs7Ozs7Ozs7O0FDQXJILCtEQUFnQixDQUFDLG9HQUFvRyxFOzs7Ozs7Ozs7Ozs7QUNBckgsK0RBQWdCLENBQUMsbUlBQW1JLGlVQUFpVSxFOzs7Ozs7Ozs7Ozs7QUNBcmQsK0RBQWdCLENBQUMsd0lBQXdJLHFaQUFxWixFOzs7Ozs7Ozs7O0FDQTlpQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUNKQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNSYSxrQkFBa0IsTUFBTSx3QkFBd0Isa0JBQWtCLDJCQUEyQixxQkFBcUIsZ0NBQWdDLGdDQUFnQyxtQ0FBbUMsNEJBQTRCLCtCQUErQixvQkFBb0IseUJBQXlCLFVBQVU7QUFDcFYsaUQ7Ozs7Ozs7Ozs7QUNEQSwyR0FBK0M7Ozs7Ozs7Ozs7O0FDQS9DLHlHQUE4Qzs7Ozs7Ozs7Ozs7QUNBOUM7QUFDQTtBQUNBLG1CQUFtQixzQkFBc0I7QUFDekM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSwwQjs7Ozs7Ozs7OztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHdDOzs7Ozs7Ozs7O0FDTkEsY0FBYyxtQkFBTyxDQUFDLHdHQUErQjs7QUFFckQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEseUM7Ozs7Ozs7Ozs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxhQUFhLHVCQUF1QjtBQUNwQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLCtDOzs7Ozs7Ozs7O0FDZkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLHlCOzs7Ozs7Ozs7OztBQ2hCQSxvQzs7Ozs7Ozs7Ozs7QUNBQSwrRDs7Ozs7Ozs7Ozs7QUNBQSx5RTs7Ozs7Ozs7Ozs7QUNBQSxpRzs7Ozs7Ozs7Ozs7QUNBQSxxRTs7Ozs7Ozs7Ozs7QUNBQSwwRTs7Ozs7Ozs7Ozs7QUNBQSx5Qzs7Ozs7Ozs7Ozs7QUNBQSxnRDs7Ozs7Ozs7Ozs7QUNBQSx3Qzs7Ozs7Ozs7Ozs7QUNBQSxtQzs7Ozs7Ozs7Ozs7QUNBQSxzQzs7Ozs7Ozs7Ozs7QUNBQSwyQzs7Ozs7Ozs7Ozs7QUNBQSx5Qzs7Ozs7Ozs7Ozs7QUNBQSxtRDs7Ozs7Ozs7OztBQ0FBLGUiLCJmaWxlIjoicGFnZXMvX2FwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO3ZhciBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0PXJlcXVpcmUoXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL2ludGVyb3BSZXF1aXJlRGVmYXVsdFwiKTtleHBvcnRzLl9fZXNNb2R1bGU9dHJ1ZTtleHBvcnRzLmRlZmF1bHQ9SW1hZ2U7dmFyIF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlMj1faW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2VcIikpO3ZhciBfZXh0ZW5kczI9X2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiQGJhYmVsL3J1bnRpbWUvaGVscGVycy9leHRlbmRzXCIpKTt2YXIgX3JlYWN0PV9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcInJlYWN0XCIpKTt2YXIgX2hlYWQ9X2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi4vbmV4dC1zZXJ2ZXIvbGliL2hlYWRcIikpO3ZhciBfdG9CYXNlPXJlcXVpcmUoXCIuLi9uZXh0LXNlcnZlci9saWIvdG8tYmFzZS02NFwiKTt2YXIgX2ltYWdlQ29uZmlnPXJlcXVpcmUoXCIuLi9uZXh0LXNlcnZlci9zZXJ2ZXIvaW1hZ2UtY29uZmlnXCIpO3ZhciBfdXNlSW50ZXJzZWN0aW9uPXJlcXVpcmUoXCIuL3VzZS1pbnRlcnNlY3Rpb25cIik7aWYodHlwZW9mIHdpbmRvdz09PSd1bmRlZmluZWQnKXs7Z2xvYmFsLl9fTkVYVF9JTUFHRV9JTVBPUlRFRD10cnVlO31jb25zdCBWQUxJRF9MT0FESU5HX1ZBTFVFUz1bJ2xhenknLCdlYWdlcicsdW5kZWZpbmVkXTtjb25zdCBsb2FkZXJzPW5ldyBNYXAoW1snaW1naXgnLGltZ2l4TG9hZGVyXSxbJ2Nsb3VkaW5hcnknLGNsb3VkaW5hcnlMb2FkZXJdLFsnYWthbWFpJyxha2FtYWlMb2FkZXJdLFsnZGVmYXVsdCcsZGVmYXVsdExvYWRlcl1dKTtjb25zdCBWQUxJRF9MQVlPVVRfVkFMVUVTPVsnZmlsbCcsJ2ZpeGVkJywnaW50cmluc2ljJywncmVzcG9uc2l2ZScsdW5kZWZpbmVkXTtmdW5jdGlvbiBpc1N0YXRpY1JlcXVpcmUoc3JjKXtyZXR1cm4gc3JjLmRlZmF1bHQhPT11bmRlZmluZWQ7fWZ1bmN0aW9uIGlzU3RhdGljSW1hZ2VEYXRhKHNyYyl7cmV0dXJuIHNyYy5zcmMhPT11bmRlZmluZWQ7fWZ1bmN0aW9uIGlzU3RhdGljSW1wb3J0KHNyYyl7cmV0dXJuIHR5cGVvZiBzcmM9PT0nb2JqZWN0JyYmKGlzU3RhdGljUmVxdWlyZShzcmMpfHxpc1N0YXRpY0ltYWdlRGF0YShzcmMpKTt9Y29uc3R7ZGV2aWNlU2l6ZXM6Y29uZmlnRGV2aWNlU2l6ZXMsaW1hZ2VTaXplczpjb25maWdJbWFnZVNpemVzLGxvYWRlcjpjb25maWdMb2FkZXIscGF0aDpjb25maWdQYXRoLGRvbWFpbnM6Y29uZmlnRG9tYWluc309cHJvY2Vzcy5lbnYuX19ORVhUX0lNQUdFX09QVFN8fF9pbWFnZUNvbmZpZy5pbWFnZUNvbmZpZ0RlZmF1bHQ7Ly8gc29ydCBzbWFsbGVzdCB0byBsYXJnZXN0XG5jb25zdCBhbGxTaXplcz1bLi4uY29uZmlnRGV2aWNlU2l6ZXMsLi4uY29uZmlnSW1hZ2VTaXplc107Y29uZmlnRGV2aWNlU2l6ZXMuc29ydCgoYSxiKT0+YS1iKTthbGxTaXplcy5zb3J0KChhLGIpPT5hLWIpO2Z1bmN0aW9uIGdldFdpZHRocyh3aWR0aCxsYXlvdXQsc2l6ZXMpe2lmKHNpemVzJiYobGF5b3V0PT09J2ZpbGwnfHxsYXlvdXQ9PT0ncmVzcG9uc2l2ZScpKXsvLyBGaW5kIGFsbCB0aGUgXCJ2d1wiIHBlcmNlbnQgc2l6ZXMgdXNlZCBpbiB0aGUgc2l6ZXMgcHJvcFxuY29uc3Qgdmlld3BvcnRXaWR0aFJlPS8oXnxcXHMpKDE/XFxkP1xcZCl2dy9nO2NvbnN0IHBlcmNlbnRTaXplcz1bXTtmb3IobGV0IG1hdGNoO21hdGNoPXZpZXdwb3J0V2lkdGhSZS5leGVjKHNpemVzKTttYXRjaCl7cGVyY2VudFNpemVzLnB1c2gocGFyc2VJbnQobWF0Y2hbMl0pKTt9aWYocGVyY2VudFNpemVzLmxlbmd0aCl7Y29uc3Qgc21hbGxlc3RSYXRpbz1NYXRoLm1pbiguLi5wZXJjZW50U2l6ZXMpKjAuMDE7cmV0dXJue3dpZHRoczphbGxTaXplcy5maWx0ZXIocz0+cz49Y29uZmlnRGV2aWNlU2l6ZXNbMF0qc21hbGxlc3RSYXRpbyksa2luZDondyd9O31yZXR1cm57d2lkdGhzOmFsbFNpemVzLGtpbmQ6J3cnfTt9aWYodHlwZW9mIHdpZHRoIT09J251bWJlcid8fGxheW91dD09PSdmaWxsJ3x8bGF5b3V0PT09J3Jlc3BvbnNpdmUnKXtyZXR1cm57d2lkdGhzOmNvbmZpZ0RldmljZVNpemVzLGtpbmQ6J3cnfTt9Y29uc3Qgd2lkdGhzPVsuLi5uZXcgU2V0KC8vID4gVGhpcyBtZWFucyB0aGF0IG1vc3QgT0xFRCBzY3JlZW5zIHRoYXQgc2F5IHRoZXkgYXJlIDN4IHJlc29sdXRpb24sXG4vLyA+IGFyZSBhY3R1YWxseSAzeCBpbiB0aGUgZ3JlZW4gY29sb3IsIGJ1dCBvbmx5IDEuNXggaW4gdGhlIHJlZCBhbmRcbi8vID4gYmx1ZSBjb2xvcnMuIFNob3dpbmcgYSAzeCByZXNvbHV0aW9uIGltYWdlIGluIHRoZSBhcHAgdnMgYSAyeFxuLy8gPiByZXNvbHV0aW9uIGltYWdlIHdpbGwgYmUgdmlzdWFsbHkgdGhlIHNhbWUsIHRob3VnaCB0aGUgM3ggaW1hZ2Vcbi8vID4gdGFrZXMgc2lnbmlmaWNhbnRseSBtb3JlIGRhdGEuIEV2ZW4gdHJ1ZSAzeCByZXNvbHV0aW9uIHNjcmVlbnMgYXJlXG4vLyA+IHdhc3RlZnVsIGFzIHRoZSBodW1hbiBleWUgY2Fubm90IHNlZSB0aGF0IGxldmVsIG9mIGRldGFpbCB3aXRob3V0XG4vLyA+IHNvbWV0aGluZyBsaWtlIGEgbWFnbmlmeWluZyBnbGFzcy5cbi8vIGh0dHBzOi8vYmxvZy50d2l0dGVyLmNvbS9lbmdpbmVlcmluZy9lbl91cy90b3BpY3MvaW5mcmFzdHJ1Y3R1cmUvMjAxOS9jYXBwaW5nLWltYWdlLWZpZGVsaXR5LW9uLXVsdHJhLWhpZ2gtcmVzb2x1dGlvbi1kZXZpY2VzLmh0bWxcblt3aWR0aCx3aWR0aCoyLyosIHdpZHRoICogMyovXS5tYXAodz0+YWxsU2l6ZXMuZmluZChwPT5wPj13KXx8YWxsU2l6ZXNbYWxsU2l6ZXMubGVuZ3RoLTFdKSldO3JldHVybnt3aWR0aHMsa2luZDoneCd9O31mdW5jdGlvbiBnZW5lcmF0ZUltZ0F0dHJzKHtzcmMsdW5vcHRpbWl6ZWQsbGF5b3V0LHdpZHRoLHF1YWxpdHksc2l6ZXMsbG9hZGVyfSl7aWYodW5vcHRpbWl6ZWQpe3JldHVybntzcmMsc3JjU2V0OnVuZGVmaW5lZCxzaXplczp1bmRlZmluZWR9O31jb25zdHt3aWR0aHMsa2luZH09Z2V0V2lkdGhzKHdpZHRoLGxheW91dCxzaXplcyk7Y29uc3QgbGFzdD13aWR0aHMubGVuZ3RoLTE7cmV0dXJue3NpemVzOiFzaXplcyYma2luZD09PSd3Jz8nMTAwdncnOnNpemVzLHNyY1NldDp3aWR0aHMubWFwKCh3LGkpPT5gJHtsb2FkZXIoe3NyYyxxdWFsaXR5LHdpZHRoOnd9KX0gJHtraW5kPT09J3cnP3c6aSsxfSR7a2luZH1gKS5qb2luKCcsICcpLC8vIEl0J3MgaW50ZW5kZWQgdG8ga2VlcCBgc3JjYCB0aGUgbGFzdCBhdHRyaWJ1dGUgYmVjYXVzZSBSZWFjdCB1cGRhdGVzXG4vLyBhdHRyaWJ1dGVzIGluIG9yZGVyLiBJZiB3ZSBrZWVwIGBzcmNgIHRoZSBmaXJzdCBvbmUsIFNhZmFyaSB3aWxsXG4vLyBpbW1lZGlhdGVseSBzdGFydCB0byBmZXRjaCBgc3JjYCwgYmVmb3JlIGBzaXplc2AgYW5kIGBzcmNTZXRgIGFyZSBldmVuXG4vLyB1cGRhdGVkIGJ5IFJlYWN0LiBUaGF0IGNhdXNlcyBtdWx0aXBsZSB1bm5lY2Vzc2FyeSByZXF1ZXN0cyBpZiBgc3JjU2V0YFxuLy8gYW5kIGBzaXplc2AgYXJlIGRlZmluZWQuXG4vLyBUaGlzIGJ1ZyBjYW5ub3QgYmUgcmVwcm9kdWNlZCBpbiBDaHJvbWUgb3IgRmlyZWZveC5cbnNyYzpsb2FkZXIoe3NyYyxxdWFsaXR5LHdpZHRoOndpZHRoc1tsYXN0XX0pfTt9ZnVuY3Rpb24gZ2V0SW50KHgpe2lmKHR5cGVvZiB4PT09J251bWJlcicpe3JldHVybiB4O31pZih0eXBlb2YgeD09PSdzdHJpbmcnKXtyZXR1cm4gcGFyc2VJbnQoeCwxMCk7fXJldHVybiB1bmRlZmluZWQ7fWZ1bmN0aW9uIGRlZmF1bHRJbWFnZUxvYWRlcihsb2FkZXJQcm9wcyl7Y29uc3QgbG9hZD1sb2FkZXJzLmdldChjb25maWdMb2FkZXIpO2lmKGxvYWQpe3JldHVybiBsb2FkKCgwLF9leHRlbmRzMi5kZWZhdWx0KSh7cm9vdDpjb25maWdQYXRofSxsb2FkZXJQcm9wcykpO310aHJvdyBuZXcgRXJyb3IoYFVua25vd24gXCJsb2FkZXJcIiBmb3VuZCBpbiBcIm5leHQuY29uZmlnLmpzXCIuIEV4cGVjdGVkOiAke19pbWFnZUNvbmZpZy5WQUxJRF9MT0FERVJTLmpvaW4oJywgJyl9LiBSZWNlaXZlZDogJHtjb25maWdMb2FkZXJ9YCk7fS8vIFNlZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3EvMzk3Nzc4MzMvMjY2NTM1IGZvciB3aHkgd2UgdXNlIHRoaXMgcmVmXG4vLyBoYW5kbGVyIGluc3RlYWQgb2YgdGhlIGltZydzIG9uTG9hZCBhdHRyaWJ1dGUuXG5mdW5jdGlvbiByZW1vdmVQbGFjZWhvbGRlcihpbWcscGxhY2Vob2xkZXIpe2lmKHBsYWNlaG9sZGVyPT09J2JsdXInJiZpbWcpe2NvbnN0IGhhbmRsZUxvYWQ9KCk9PntpZighaW1nLnNyYy5zdGFydHNXaXRoKCdkYXRhOicpKXtjb25zdCBwPSdkZWNvZGUnaW4gaW1nP2ltZy5kZWNvZGUoKTpQcm9taXNlLnJlc29sdmUoKTtwLmNhdGNoKCgpPT57fSkudGhlbigoKT0+e2ltZy5zdHlsZS5maWx0ZXI9J25vbmUnO2ltZy5zdHlsZS5iYWNrZ3JvdW5kU2l6ZT0nbm9uZSc7aW1nLnN0eWxlLmJhY2tncm91bmRJbWFnZT0nbm9uZSc7fSk7fX07aWYoaW1nLmNvbXBsZXRlKXsvLyBJZiB0aGUgcmVhbCBpbWFnZSBmYWlscyB0byBsb2FkLCB0aGlzIHdpbGwgc3RpbGwgcmVtb3ZlIHRoZSBwbGFjZWhvbGRlci5cbi8vIFRoaXMgaXMgdGhlIGRlc2lyZWQgYmVoYXZpb3IgZm9yIG5vdywgYW5kIHdpbGwgYmUgcmV2aXNpdGVkIHdoZW4gZXJyb3Jcbi8vIGhhbmRsaW5nIGlzIHdvcmtlZCBvbiBmb3IgdGhlIGltYWdlIGNvbXBvbmVudCBpdHNlbGYuXG5oYW5kbGVMb2FkKCk7fWVsc2V7aW1nLm9ubG9hZD1oYW5kbGVMb2FkO319fWZ1bmN0aW9uIEltYWdlKF9yZWYpe2xldHtzcmMsc2l6ZXMsdW5vcHRpbWl6ZWQ9ZmFsc2UscHJpb3JpdHk9ZmFsc2UsbG9hZGluZyxjbGFzc05hbWUscXVhbGl0eSx3aWR0aCxoZWlnaHQsb2JqZWN0Rml0LG9iamVjdFBvc2l0aW9uLGxvYWRlcj1kZWZhdWx0SW1hZ2VMb2FkZXIscGxhY2Vob2xkZXI9J2VtcHR5JyxibHVyRGF0YVVSTH09X3JlZixhbGw9KDAsX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UyLmRlZmF1bHQpKF9yZWYsW1wic3JjXCIsXCJzaXplc1wiLFwidW5vcHRpbWl6ZWRcIixcInByaW9yaXR5XCIsXCJsb2FkaW5nXCIsXCJjbGFzc05hbWVcIixcInF1YWxpdHlcIixcIndpZHRoXCIsXCJoZWlnaHRcIixcIm9iamVjdEZpdFwiLFwib2JqZWN0UG9zaXRpb25cIixcImxvYWRlclwiLFwicGxhY2Vob2xkZXJcIixcImJsdXJEYXRhVVJMXCJdKTtsZXQgcmVzdD1hbGw7bGV0IGxheW91dD1zaXplcz8ncmVzcG9uc2l2ZSc6J2ludHJpbnNpYyc7aWYoJ2xheW91dCdpbiByZXN0KXsvLyBPdmVycmlkZSBkZWZhdWx0IGxheW91dCBpZiB0aGUgdXNlciBzcGVjaWZpZWQgb25lOlxuaWYocmVzdC5sYXlvdXQpbGF5b3V0PXJlc3QubGF5b3V0Oy8vIFJlbW92ZSBwcm9wZXJ0eSBzbyBpdCdzIG5vdCBzcHJlYWQgaW50byBpbWFnZTpcbmRlbGV0ZSByZXN0WydsYXlvdXQnXTt9bGV0IHN0YXRpY1NyYz0nJztpZihpc1N0YXRpY0ltcG9ydChzcmMpKXtjb25zdCBzdGF0aWNJbWFnZURhdGE9aXNTdGF0aWNSZXF1aXJlKHNyYyk/c3JjLmRlZmF1bHQ6c3JjO2lmKCFzdGF0aWNJbWFnZURhdGEuc3JjKXt0aHJvdyBuZXcgRXJyb3IoYEFuIG9iamVjdCBzaG91bGQgb25seSBiZSBwYXNzZWQgdG8gdGhlIGltYWdlIGNvbXBvbmVudCBzcmMgcGFyYW1ldGVyIGlmIGl0IGNvbWVzIGZyb20gYSBzdGF0aWMgaW1hZ2UgaW1wb3J0LiBJdCBtdXN0IGluY2x1ZGUgc3JjLiBSZWNlaXZlZCAke0pTT04uc3RyaW5naWZ5KHN0YXRpY0ltYWdlRGF0YSl9YCk7fWJsdXJEYXRhVVJMPWJsdXJEYXRhVVJMfHxzdGF0aWNJbWFnZURhdGEuYmx1ckRhdGFVUkw7c3RhdGljU3JjPXN0YXRpY0ltYWdlRGF0YS5zcmM7aWYoIWxheW91dHx8bGF5b3V0IT09J2ZpbGwnKXtoZWlnaHQ9aGVpZ2h0fHxzdGF0aWNJbWFnZURhdGEuaGVpZ2h0O3dpZHRoPXdpZHRofHxzdGF0aWNJbWFnZURhdGEud2lkdGg7aWYoIXN0YXRpY0ltYWdlRGF0YS5oZWlnaHR8fCFzdGF0aWNJbWFnZURhdGEud2lkdGgpe3Rocm93IG5ldyBFcnJvcihgQW4gb2JqZWN0IHNob3VsZCBvbmx5IGJlIHBhc3NlZCB0byB0aGUgaW1hZ2UgY29tcG9uZW50IHNyYyBwYXJhbWV0ZXIgaWYgaXQgY29tZXMgZnJvbSBhIHN0YXRpYyBpbWFnZSBpbXBvcnQuIEl0IG11c3QgaW5jbHVkZSBoZWlnaHQgYW5kIHdpZHRoLiBSZWNlaXZlZCAke0pTT04uc3RyaW5naWZ5KHN0YXRpY0ltYWdlRGF0YSl9YCk7fX19c3JjPXR5cGVvZiBzcmM9PT0nc3RyaW5nJz9zcmM6c3RhdGljU3JjO2NvbnN0IHdpZHRoSW50PWdldEludCh3aWR0aCk7Y29uc3QgaGVpZ2h0SW50PWdldEludChoZWlnaHQpO2NvbnN0IHF1YWxpdHlJbnQ9Z2V0SW50KHF1YWxpdHkpO2lmKHByb2Nlc3MuZW52Lk5PREVfRU5WIT09J3Byb2R1Y3Rpb24nKXtpZighc3JjKXt0aHJvdyBuZXcgRXJyb3IoYEltYWdlIGlzIG1pc3NpbmcgcmVxdWlyZWQgXCJzcmNcIiBwcm9wZXJ0eS4gTWFrZSBzdXJlIHlvdSBwYXNzIFwic3JjXCIgaW4gcHJvcHMgdG8gdGhlIFxcYG5leHQvaW1hZ2VcXGAgY29tcG9uZW50LiBSZWNlaXZlZDogJHtKU09OLnN0cmluZ2lmeSh7d2lkdGgsaGVpZ2h0LHF1YWxpdHl9KX1gKTt9aWYoIVZBTElEX0xBWU9VVF9WQUxVRVMuaW5jbHVkZXMobGF5b3V0KSl7dGhyb3cgbmV3IEVycm9yKGBJbWFnZSB3aXRoIHNyYyBcIiR7c3JjfVwiIGhhcyBpbnZhbGlkIFwibGF5b3V0XCIgcHJvcGVydHkuIFByb3ZpZGVkIFwiJHtsYXlvdXR9XCIgc2hvdWxkIGJlIG9uZSBvZiAke1ZBTElEX0xBWU9VVF9WQUxVRVMubWFwKFN0cmluZykuam9pbignLCcpfS5gKTt9aWYodHlwZW9mIHdpZHRoSW50IT09J3VuZGVmaW5lZCcmJmlzTmFOKHdpZHRoSW50KXx8dHlwZW9mIGhlaWdodEludCE9PSd1bmRlZmluZWQnJiZpc05hTihoZWlnaHRJbnQpKXt0aHJvdyBuZXcgRXJyb3IoYEltYWdlIHdpdGggc3JjIFwiJHtzcmN9XCIgaGFzIGludmFsaWQgXCJ3aWR0aFwiIG9yIFwiaGVpZ2h0XCIgcHJvcGVydHkuIFRoZXNlIHNob3VsZCBiZSBudW1lcmljIHZhbHVlcy5gKTt9aWYoIVZBTElEX0xPQURJTkdfVkFMVUVTLmluY2x1ZGVzKGxvYWRpbmcpKXt0aHJvdyBuZXcgRXJyb3IoYEltYWdlIHdpdGggc3JjIFwiJHtzcmN9XCIgaGFzIGludmFsaWQgXCJsb2FkaW5nXCIgcHJvcGVydHkuIFByb3ZpZGVkIFwiJHtsb2FkaW5nfVwiIHNob3VsZCBiZSBvbmUgb2YgJHtWQUxJRF9MT0FESU5HX1ZBTFVFUy5tYXAoU3RyaW5nKS5qb2luKCcsJyl9LmApO31pZihwcmlvcml0eSYmbG9hZGluZz09PSdsYXp5Jyl7dGhyb3cgbmV3IEVycm9yKGBJbWFnZSB3aXRoIHNyYyBcIiR7c3JjfVwiIGhhcyBib3RoIFwicHJpb3JpdHlcIiBhbmQgXCJsb2FkaW5nPSdsYXp5J1wiIHByb3BlcnRpZXMuIE9ubHkgb25lIHNob3VsZCBiZSB1c2VkLmApO31pZihwbGFjZWhvbGRlcj09PSdibHVyJyl7aWYobGF5b3V0IT09J2ZpbGwnJiYod2lkdGhJbnR8fDApKihoZWlnaHRJbnR8fDApPDE2MDApe2NvbnNvbGUud2FybihgSW1hZ2Ugd2l0aCBzcmMgXCIke3NyY31cIiBpcyBzbWFsbGVyIHRoYW4gNDB4NDAuIENvbnNpZGVyIHJlbW92aW5nIHRoZSBcInBsYWNlaG9sZGVyPSdibHVyJ1wiIHByb3BlcnR5IHRvIGltcHJvdmUgcGVyZm9ybWFuY2UuYCk7fWlmKCFibHVyRGF0YVVSTCl7Y29uc3QgVkFMSURfQkxVUl9FWFQ9WydqcGVnJywncG5nJywnd2VicCddOy8vIHNob3VsZCBtYXRjaCBuZXh0LWltYWdlLWxvYWRlclxudGhyb3cgbmV3IEVycm9yKGBJbWFnZSB3aXRoIHNyYyBcIiR7c3JjfVwiIGhhcyBcInBsYWNlaG9sZGVyPSdibHVyJ1wiIHByb3BlcnR5IGJ1dCBpcyBtaXNzaW5nIHRoZSBcImJsdXJEYXRhVVJMXCIgcHJvcGVydHkuXG4gICAgICAgICAgUG9zc2libGUgc29sdXRpb25zOlxuICAgICAgICAgICAgLSBBZGQgYSBcImJsdXJEYXRhVVJMXCIgcHJvcGVydHksIHRoZSBjb250ZW50cyBzaG91bGQgYmUgYSBzbWFsbCBEYXRhIFVSTCB0byByZXByZXNlbnQgdGhlIGltYWdlXG4gICAgICAgICAgICAtIENoYW5nZSB0aGUgXCJzcmNcIiBwcm9wZXJ0eSB0byBhIHN0YXRpYyBpbXBvcnQgd2l0aCBvbmUgb2YgdGhlIHN1cHBvcnRlZCBmaWxlIHR5cGVzOiAke1ZBTElEX0JMVVJfRVhULmpvaW4oJywnKX1cbiAgICAgICAgICAgIC0gUmVtb3ZlIHRoZSBcInBsYWNlaG9sZGVyXCIgcHJvcGVydHksIGVmZmVjdGl2ZWx5IG5vIGJsdXIgZWZmZWN0XG4gICAgICAgICAgUmVhZCBtb3JlOiBodHRwczovL25leHRqcy5vcmcvZG9jcy9tZXNzYWdlcy9wbGFjZWhvbGRlci1ibHVyLWRhdGEtdXJsYCk7fX19bGV0IGlzTGF6eT0hcHJpb3JpdHkmJihsb2FkaW5nPT09J2xhenknfHx0eXBlb2YgbG9hZGluZz09PSd1bmRlZmluZWQnKTtpZihzcmMmJnNyYy5zdGFydHNXaXRoKCdkYXRhOicpKXsvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9IVFRQL0Jhc2ljc19vZl9IVFRQL0RhdGFfVVJJc1xudW5vcHRpbWl6ZWQ9dHJ1ZTtpc0xhenk9ZmFsc2U7fWNvbnN0W3NldFJlZixpc0ludGVyc2VjdGVkXT0oMCxfdXNlSW50ZXJzZWN0aW9uLnVzZUludGVyc2VjdGlvbikoe3Jvb3RNYXJnaW46JzIwMHB4JyxkaXNhYmxlZDohaXNMYXp5fSk7Y29uc3QgaXNWaXNpYmxlPSFpc0xhenl8fGlzSW50ZXJzZWN0ZWQ7bGV0IHdyYXBwZXJTdHlsZTtsZXQgc2l6ZXJTdHlsZTtsZXQgc2l6ZXJTdmc7bGV0IGltZ1N0eWxlPSgwLF9leHRlbmRzMi5kZWZhdWx0KSh7cG9zaXRpb246J2Fic29sdXRlJyx0b3A6MCxsZWZ0OjAsYm90dG9tOjAscmlnaHQ6MCxib3hTaXppbmc6J2JvcmRlci1ib3gnLHBhZGRpbmc6MCxib3JkZXI6J25vbmUnLG1hcmdpbjonYXV0bycsZGlzcGxheTonYmxvY2snLHdpZHRoOjAsaGVpZ2h0OjAsbWluV2lkdGg6JzEwMCUnLG1heFdpZHRoOicxMDAlJyxtaW5IZWlnaHQ6JzEwMCUnLG1heEhlaWdodDonMTAwJScsb2JqZWN0Rml0LG9iamVjdFBvc2l0aW9ufSxwbGFjZWhvbGRlcj09PSdibHVyJz97ZmlsdGVyOidibHVyKDIwcHgpJyxiYWNrZ3JvdW5kU2l6ZTonY292ZXInLGJhY2tncm91bmRJbWFnZTpgdXJsKFwiJHtibHVyRGF0YVVSTH1cIilgfTp1bmRlZmluZWQpO2lmKHR5cGVvZiB3aWR0aEludCE9PSd1bmRlZmluZWQnJiZ0eXBlb2YgaGVpZ2h0SW50IT09J3VuZGVmaW5lZCcmJmxheW91dCE9PSdmaWxsJyl7Ly8gPEltYWdlIHNyYz1cImkucG5nXCIgd2lkdGg9XCIxMDBcIiBoZWlnaHQ9XCIxMDBcIiAvPlxuY29uc3QgcXVvdGllbnQ9aGVpZ2h0SW50L3dpZHRoSW50O2NvbnN0IHBhZGRpbmdUb3A9aXNOYU4ocXVvdGllbnQpPycxMDAlJzpgJHtxdW90aWVudCoxMDB9JWA7aWYobGF5b3V0PT09J3Jlc3BvbnNpdmUnKXsvLyA8SW1hZ2Ugc3JjPVwiaS5wbmdcIiB3aWR0aD1cIjEwMFwiIGhlaWdodD1cIjEwMFwiIGxheW91dD1cInJlc3BvbnNpdmVcIiAvPlxud3JhcHBlclN0eWxlPXtkaXNwbGF5OidibG9jaycsb3ZlcmZsb3c6J2hpZGRlbicscG9zaXRpb246J3JlbGF0aXZlJyxib3hTaXppbmc6J2JvcmRlci1ib3gnLG1hcmdpbjowfTtzaXplclN0eWxlPXtkaXNwbGF5OidibG9jaycsYm94U2l6aW5nOidib3JkZXItYm94JyxwYWRkaW5nVG9wfTt9ZWxzZSBpZihsYXlvdXQ9PT0naW50cmluc2ljJyl7Ly8gPEltYWdlIHNyYz1cImkucG5nXCIgd2lkdGg9XCIxMDBcIiBoZWlnaHQ9XCIxMDBcIiBsYXlvdXQ9XCJpbnRyaW5zaWNcIiAvPlxud3JhcHBlclN0eWxlPXtkaXNwbGF5OidpbmxpbmUtYmxvY2snLG1heFdpZHRoOicxMDAlJyxvdmVyZmxvdzonaGlkZGVuJyxwb3NpdGlvbjoncmVsYXRpdmUnLGJveFNpemluZzonYm9yZGVyLWJveCcsbWFyZ2luOjB9O3NpemVyU3R5bGU9e2JveFNpemluZzonYm9yZGVyLWJveCcsZGlzcGxheTonYmxvY2snLG1heFdpZHRoOicxMDAlJ307c2l6ZXJTdmc9YDxzdmcgd2lkdGg9XCIke3dpZHRoSW50fVwiIGhlaWdodD1cIiR7aGVpZ2h0SW50fVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2ZXJzaW9uPVwiMS4xXCIvPmA7fWVsc2UgaWYobGF5b3V0PT09J2ZpeGVkJyl7Ly8gPEltYWdlIHNyYz1cImkucG5nXCIgd2lkdGg9XCIxMDBcIiBoZWlnaHQ9XCIxMDBcIiBsYXlvdXQ9XCJmaXhlZFwiIC8+XG53cmFwcGVyU3R5bGU9e292ZXJmbG93OidoaWRkZW4nLGJveFNpemluZzonYm9yZGVyLWJveCcsZGlzcGxheTonaW5saW5lLWJsb2NrJyxwb3NpdGlvbjoncmVsYXRpdmUnLHdpZHRoOndpZHRoSW50LGhlaWdodDpoZWlnaHRJbnR9O319ZWxzZSBpZih0eXBlb2Ygd2lkdGhJbnQ9PT0ndW5kZWZpbmVkJyYmdHlwZW9mIGhlaWdodEludD09PSd1bmRlZmluZWQnJiZsYXlvdXQ9PT0nZmlsbCcpey8vIDxJbWFnZSBzcmM9XCJpLnBuZ1wiIGxheW91dD1cImZpbGxcIiAvPlxud3JhcHBlclN0eWxlPXtkaXNwbGF5OidibG9jaycsb3ZlcmZsb3c6J2hpZGRlbicscG9zaXRpb246J2Fic29sdXRlJyx0b3A6MCxsZWZ0OjAsYm90dG9tOjAscmlnaHQ6MCxib3hTaXppbmc6J2JvcmRlci1ib3gnLG1hcmdpbjowfTt9ZWxzZXsvLyA8SW1hZ2Ugc3JjPVwiaS5wbmdcIiAvPlxuaWYocHJvY2Vzcy5lbnYuTk9ERV9FTlYhPT0ncHJvZHVjdGlvbicpe3Rocm93IG5ldyBFcnJvcihgSW1hZ2Ugd2l0aCBzcmMgXCIke3NyY31cIiBtdXN0IHVzZSBcIndpZHRoXCIgYW5kIFwiaGVpZ2h0XCIgcHJvcGVydGllcyBvciBcImxheW91dD0nZmlsbCdcIiBwcm9wZXJ0eS5gKTt9fWxldCBpbWdBdHRyaWJ1dGVzPXtzcmM6J2RhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaEFRQUJBSUFBQUFBQUFQLy8veUg1QkFFQUFBQUFMQUFBQUFBQkFBRUFBQUlCUkFBNycsc3JjU2V0OnVuZGVmaW5lZCxzaXplczp1bmRlZmluZWR9O2lmKGlzVmlzaWJsZSl7aW1nQXR0cmlidXRlcz1nZW5lcmF0ZUltZ0F0dHJzKHtzcmMsdW5vcHRpbWl6ZWQsbGF5b3V0LHdpZHRoOndpZHRoSW50LHF1YWxpdHk6cXVhbGl0eUludCxzaXplcyxsb2FkZXJ9KTt9cmV0dXJuLyojX19QVVJFX18qL19yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIix7c3R5bGU6d3JhcHBlclN0eWxlfSxzaXplclN0eWxlPy8qI19fUFVSRV9fKi9fcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIse3N0eWxlOnNpemVyU3R5bGV9LHNpemVyU3ZnPy8qI19fUFVSRV9fKi9fcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwiaW1nXCIse3N0eWxlOnttYXhXaWR0aDonMTAwJScsZGlzcGxheTonYmxvY2snLG1hcmdpbjowLGJvcmRlcjonbm9uZScscGFkZGluZzowfSxhbHQ6XCJcIixcImFyaWEtaGlkZGVuXCI6dHJ1ZSxyb2xlOlwicHJlc2VudGF0aW9uXCIsc3JjOmBkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LCR7KDAsX3RvQmFzZS50b0Jhc2U2NCkoc2l6ZXJTdmcpfWB9KTpudWxsKTpudWxsLCFpc1Zpc2libGUmJi8qI19fUFVSRV9fKi9fcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwibm9zY3JpcHRcIixudWxsLC8qI19fUFVSRV9fKi9fcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwiaW1nXCIsT2JqZWN0LmFzc2lnbih7fSxyZXN0LGdlbmVyYXRlSW1nQXR0cnMoe3NyYyx1bm9wdGltaXplZCxsYXlvdXQsd2lkdGg6d2lkdGhJbnQscXVhbGl0eTpxdWFsaXR5SW50LHNpemVzLGxvYWRlcn0pLHtkZWNvZGluZzpcImFzeW5jXCIsc3R5bGU6aW1nU3R5bGUsY2xhc3NOYW1lOmNsYXNzTmFtZX0pKSksLyojX19QVVJFX18qL19yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIixPYmplY3QuYXNzaWduKHt9LHJlc3QsaW1nQXR0cmlidXRlcyx7ZGVjb2Rpbmc6XCJhc3luY1wiLGNsYXNzTmFtZTpjbGFzc05hbWUscmVmOmVsZW1lbnQ9PntzZXRSZWYoZWxlbWVudCk7cmVtb3ZlUGxhY2Vob2xkZXIoZWxlbWVudCxwbGFjZWhvbGRlcik7fSxzdHlsZTppbWdTdHlsZX0pKSxwcmlvcml0eT8vKiNfX1BVUkVfXyovIC8vIE5vdGUgaG93IHdlIG9taXQgdGhlIGBocmVmYCBhdHRyaWJ1dGUsIGFzIGl0IHdvdWxkIG9ubHkgYmUgcmVsZXZhbnRcbi8vIGZvciBicm93c2VycyB0aGF0IGRvIG5vdCBzdXBwb3J0IGBpbWFnZXNyY3NldGAsIGFuZCBpbiB0aG9zZSBjYXNlc1xuLy8gaXQgd291bGQgbGlrZWx5IGNhdXNlIHRoZSBpbmNvcnJlY3QgaW1hZ2UgdG8gYmUgcHJlbG9hZGVkLlxuLy9cbi8vIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL3NlbWFudGljcy5odG1sI2F0dHItbGluay1pbWFnZXNyY3NldFxuX3JlYWN0LmRlZmF1bHQuY3JlYXRlRWxlbWVudChfaGVhZC5kZWZhdWx0LG51bGwsLyojX19QVVJFX18qL19yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIse2tleTonX19uaW1nLScraW1nQXR0cmlidXRlcy5zcmMraW1nQXR0cmlidXRlcy5zcmNTZXQraW1nQXR0cmlidXRlcy5zaXplcyxyZWw6XCJwcmVsb2FkXCIsYXM6XCJpbWFnZVwiLGhyZWY6aW1nQXR0cmlidXRlcy5zcmNTZXQ/dW5kZWZpbmVkOmltZ0F0dHJpYnV0ZXMuc3JjLy8gQHRzLWlnbm9yZTogaW1hZ2VzcmNzZXQgaXMgbm90IHlldCBpbiB0aGUgbGluayBlbGVtZW50IHR5cGVcbixpbWFnZXNyY3NldDppbWdBdHRyaWJ1dGVzLnNyY1NldC8vIEB0cy1pZ25vcmU6IGltYWdlc2l6ZXMgaXMgbm90IHlldCBpbiB0aGUgbGluayBlbGVtZW50IHR5cGVcbixpbWFnZXNpemVzOmltZ0F0dHJpYnV0ZXMuc2l6ZXN9KSk6bnVsbCk7fS8vQlVJTFQgSU4gTE9BREVSU1xuZnVuY3Rpb24gbm9ybWFsaXplU3JjKHNyYyl7cmV0dXJuIHNyY1swXT09PScvJz9zcmMuc2xpY2UoMSk6c3JjO31mdW5jdGlvbiBpbWdpeExvYWRlcih7cm9vdCxzcmMsd2lkdGgscXVhbGl0eX0pey8vIERlbW86IGh0dHBzOi8vc3RhdGljLmltZ2l4Lm5ldC9kYWlzeS5wbmc/Zm9ybWF0PWF1dG8mZml0PW1heCZ3PTMwMFxuY29uc3QgcGFyYW1zPVsnYXV0bz1mb3JtYXQnLCdmaXQ9bWF4Jywndz0nK3dpZHRoXTtsZXQgcGFyYW1zU3RyaW5nPScnO2lmKHF1YWxpdHkpe3BhcmFtcy5wdXNoKCdxPScrcXVhbGl0eSk7fWlmKHBhcmFtcy5sZW5ndGgpe3BhcmFtc1N0cmluZz0nPycrcGFyYW1zLmpvaW4oJyYnKTt9cmV0dXJuYCR7cm9vdH0ke25vcm1hbGl6ZVNyYyhzcmMpfSR7cGFyYW1zU3RyaW5nfWA7fWZ1bmN0aW9uIGFrYW1haUxvYWRlcih7cm9vdCxzcmMsd2lkdGh9KXtyZXR1cm5gJHtyb290fSR7bm9ybWFsaXplU3JjKHNyYyl9P2ltd2lkdGg9JHt3aWR0aH1gO31mdW5jdGlvbiBjbG91ZGluYXJ5TG9hZGVyKHtyb290LHNyYyx3aWR0aCxxdWFsaXR5fSl7Ly8gRGVtbzogaHR0cHM6Ly9yZXMuY2xvdWRpbmFyeS5jb20vZGVtby9pbWFnZS91cGxvYWQvd18zMDAsY19saW1pdCxxX2F1dG8vdHVydGxlcy5qcGdcbmNvbnN0IHBhcmFtcz1bJ2ZfYXV0bycsJ2NfbGltaXQnLCd3Xycrd2lkdGgsJ3FfJysocXVhbGl0eXx8J2F1dG8nKV07bGV0IHBhcmFtc1N0cmluZz1wYXJhbXMuam9pbignLCcpKycvJztyZXR1cm5gJHtyb290fSR7cGFyYW1zU3RyaW5nfSR7bm9ybWFsaXplU3JjKHNyYyl9YDt9ZnVuY3Rpb24gZGVmYXVsdExvYWRlcih7cm9vdCxzcmMsd2lkdGgscXVhbGl0eX0pe2lmKHByb2Nlc3MuZW52Lk5PREVfRU5WIT09J3Byb2R1Y3Rpb24nKXtjb25zdCBtaXNzaW5nVmFsdWVzPVtdOy8vIHRoZXNlIHNob3VsZCBhbHdheXMgYmUgcHJvdmlkZWQgYnV0IG1ha2Ugc3VyZSB0aGV5IGFyZVxuaWYoIXNyYyltaXNzaW5nVmFsdWVzLnB1c2goJ3NyYycpO2lmKCF3aWR0aCltaXNzaW5nVmFsdWVzLnB1c2goJ3dpZHRoJyk7aWYobWlzc2luZ1ZhbHVlcy5sZW5ndGg+MCl7dGhyb3cgbmV3IEVycm9yKGBOZXh0IEltYWdlIE9wdGltaXphdGlvbiByZXF1aXJlcyAke21pc3NpbmdWYWx1ZXMuam9pbignLCAnKX0gdG8gYmUgcHJvdmlkZWQuIE1ha2Ugc3VyZSB5b3UgcGFzcyB0aGVtIGFzIHByb3BzIHRvIHRoZSBcXGBuZXh0L2ltYWdlXFxgIGNvbXBvbmVudC4gUmVjZWl2ZWQ6ICR7SlNPTi5zdHJpbmdpZnkoe3NyYyx3aWR0aCxxdWFsaXR5fSl9YCk7fWlmKHNyYy5zdGFydHNXaXRoKCcvLycpKXt0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBwYXJzZSBzcmMgXCIke3NyY31cIiBvbiBcXGBuZXh0L2ltYWdlXFxgLCBwcm90b2NvbC1yZWxhdGl2ZSBVUkwgKC8vKSBtdXN0IGJlIGNoYW5nZWQgdG8gYW4gYWJzb2x1dGUgVVJMIChodHRwOi8vIG9yIGh0dHBzOi8vKWApO31pZighc3JjLnN0YXJ0c1dpdGgoJy8nKSYmY29uZmlnRG9tYWlucyl7bGV0IHBhcnNlZFNyYzt0cnl7cGFyc2VkU3JjPW5ldyBVUkwoc3JjKTt9Y2F0Y2goZXJyKXtjb25zb2xlLmVycm9yKGVycik7dGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gcGFyc2Ugc3JjIFwiJHtzcmN9XCIgb24gXFxgbmV4dC9pbWFnZVxcYCwgaWYgdXNpbmcgcmVsYXRpdmUgaW1hZ2UgaXQgbXVzdCBzdGFydCB3aXRoIGEgbGVhZGluZyBzbGFzaCBcIi9cIiBvciBiZSBhbiBhYnNvbHV0ZSBVUkwgKGh0dHA6Ly8gb3IgaHR0cHM6Ly8pYCk7fWlmKCFjb25maWdEb21haW5zLmluY2x1ZGVzKHBhcnNlZFNyYy5ob3N0bmFtZSkpe3Rocm93IG5ldyBFcnJvcihgSW52YWxpZCBzcmMgcHJvcCAoJHtzcmN9KSBvbiBcXGBuZXh0L2ltYWdlXFxgLCBob3N0bmFtZSBcIiR7cGFyc2VkU3JjLmhvc3RuYW1lfVwiIGlzIG5vdCBjb25maWd1cmVkIHVuZGVyIGltYWdlcyBpbiB5b3VyIFxcYG5leHQuY29uZmlnLmpzXFxgXFxuYCtgU2VlIG1vcmUgaW5mbzogaHR0cHM6Ly9uZXh0anMub3JnL2RvY3MvbWVzc2FnZXMvbmV4dC1pbWFnZS11bmNvbmZpZ3VyZWQtaG9zdGApO319fXJldHVybmAke3Jvb3R9P3VybD0ke2VuY29kZVVSSUNvbXBvbmVudChzcmMpfSZ3PSR7d2lkdGh9JnE9JHtxdWFsaXR5fHw3NX1gO31cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWltYWdlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO3ZhciBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZD1yZXF1aXJlKFwiQGJhYmVsL3J1bnRpbWUvaGVscGVycy9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkXCIpO2V4cG9ydHMuX19lc01vZHVsZT10cnVlO2V4cG9ydHMuZGVmYXVsdD12b2lkIDA7dmFyIF9yZWFjdD1faW50ZXJvcFJlcXVpcmVXaWxkY2FyZChyZXF1aXJlKFwicmVhY3RcIikpO3ZhciBfcm91dGVyPXJlcXVpcmUoXCIuLi9uZXh0LXNlcnZlci9saWIvcm91dGVyL3JvdXRlclwiKTt2YXIgX3JvdXRlcjI9cmVxdWlyZShcIi4vcm91dGVyXCIpO3ZhciBfdXNlSW50ZXJzZWN0aW9uPXJlcXVpcmUoXCIuL3VzZS1pbnRlcnNlY3Rpb25cIik7Y29uc3QgcHJlZmV0Y2hlZD17fTtmdW5jdGlvbiBwcmVmZXRjaChyb3V0ZXIsaHJlZixhcyxvcHRpb25zKXtpZih0eXBlb2Ygd2luZG93PT09J3VuZGVmaW5lZCd8fCFyb3V0ZXIpcmV0dXJuO2lmKCEoMCxfcm91dGVyLmlzTG9jYWxVUkwpKGhyZWYpKXJldHVybjsvLyBQcmVmZXRjaCB0aGUgSlNPTiBwYWdlIGlmIGFza2VkIChvbmx5IGluIHRoZSBjbGllbnQpXG4vLyBXZSBuZWVkIHRvIGhhbmRsZSBhIHByZWZldGNoIGVycm9yIGhlcmUgc2luY2Ugd2UgbWF5IGJlXG4vLyBsb2FkaW5nIHdpdGggcHJpb3JpdHkgd2hpY2ggY2FuIHJlamVjdCBidXQgd2UgZG9uJ3Rcbi8vIHdhbnQgdG8gZm9yY2UgbmF2aWdhdGlvbiBzaW5jZSB0aGlzIGlzIG9ubHkgYSBwcmVmZXRjaFxucm91dGVyLnByZWZldGNoKGhyZWYsYXMsb3B0aW9ucykuY2F0Y2goZXJyPT57aWYocHJvY2Vzcy5lbnYuTk9ERV9FTlYhPT0ncHJvZHVjdGlvbicpey8vIHJldGhyb3cgdG8gc2hvdyBpbnZhbGlkIFVSTCBlcnJvcnNcbnRocm93IGVycjt9fSk7Y29uc3QgY3VyTG9jYWxlPW9wdGlvbnMmJnR5cGVvZiBvcHRpb25zLmxvY2FsZSE9PSd1bmRlZmluZWQnP29wdGlvbnMubG9jYWxlOnJvdXRlciYmcm91dGVyLmxvY2FsZTsvLyBKb2luIG9uIGFuIGludmFsaWQgVVJJIGNoYXJhY3RlclxucHJlZmV0Y2hlZFtocmVmKyclJythcysoY3VyTG9jYWxlPyclJytjdXJMb2NhbGU6JycpXT10cnVlO31mdW5jdGlvbiBpc01vZGlmaWVkRXZlbnQoZXZlbnQpe2NvbnN0e3RhcmdldH09ZXZlbnQuY3VycmVudFRhcmdldDtyZXR1cm4gdGFyZ2V0JiZ0YXJnZXQhPT0nX3NlbGYnfHxldmVudC5tZXRhS2V5fHxldmVudC5jdHJsS2V5fHxldmVudC5zaGlmdEtleXx8ZXZlbnQuYWx0S2V5fHwvLyB0cmlnZ2VycyByZXNvdXJjZSBkb3dubG9hZFxuZXZlbnQubmF0aXZlRXZlbnQmJmV2ZW50Lm5hdGl2ZUV2ZW50LndoaWNoPT09Mjt9ZnVuY3Rpb24gbGlua0NsaWNrZWQoZSxyb3V0ZXIsaHJlZixhcyxyZXBsYWNlLHNoYWxsb3csc2Nyb2xsLGxvY2FsZSl7Y29uc3R7bm9kZU5hbWV9PWUuY3VycmVudFRhcmdldDtpZihub2RlTmFtZT09PSdBJyYmKGlzTW9kaWZpZWRFdmVudChlKXx8ISgwLF9yb3V0ZXIuaXNMb2NhbFVSTCkoaHJlZikpKXsvLyBpZ25vcmUgY2xpY2sgZm9yIGJyb3dzZXLigJlzIGRlZmF1bHQgYmVoYXZpb3JcbnJldHVybjt9ZS5wcmV2ZW50RGVmYXVsdCgpOy8vICBhdm9pZCBzY3JvbGwgZm9yIHVybHMgd2l0aCBhbmNob3IgcmVmc1xuaWYoc2Nyb2xsPT1udWxsJiZhcy5pbmRleE9mKCcjJyk+PTApe3Njcm9sbD1mYWxzZTt9Ly8gcmVwbGFjZSBzdGF0ZSBpbnN0ZWFkIG9mIHB1c2ggaWYgcHJvcCBpcyBwcmVzZW50XG5yb3V0ZXJbcmVwbGFjZT8ncmVwbGFjZSc6J3B1c2gnXShocmVmLGFzLHtzaGFsbG93LGxvY2FsZSxzY3JvbGx9KTt9ZnVuY3Rpb24gTGluayhwcm9wcyl7aWYocHJvY2Vzcy5lbnYuTk9ERV9FTlYhPT0ncHJvZHVjdGlvbicpe2Z1bmN0aW9uIGNyZWF0ZVByb3BFcnJvcihhcmdzKXtyZXR1cm4gbmV3IEVycm9yKGBGYWlsZWQgcHJvcCB0eXBlOiBUaGUgcHJvcCBcXGAke2FyZ3Mua2V5fVxcYCBleHBlY3RzIGEgJHthcmdzLmV4cGVjdGVkfSBpbiBcXGA8TGluaz5cXGAsIGJ1dCBnb3QgXFxgJHthcmdzLmFjdHVhbH1cXGAgaW5zdGVhZC5gKyh0eXBlb2Ygd2luZG93IT09J3VuZGVmaW5lZCc/XCJcXG5PcGVuIHlvdXIgYnJvd3NlcidzIGNvbnNvbGUgdG8gdmlldyB0aGUgQ29tcG9uZW50IHN0YWNrIHRyYWNlLlwiOicnKSk7fS8vIFR5cGVTY3JpcHQgdHJpY2sgZm9yIHR5cGUtZ3VhcmRpbmc6XG5jb25zdCByZXF1aXJlZFByb3BzR3VhcmQ9e2hyZWY6dHJ1ZX07Y29uc3QgcmVxdWlyZWRQcm9wcz1PYmplY3Qua2V5cyhyZXF1aXJlZFByb3BzR3VhcmQpO3JlcXVpcmVkUHJvcHMuZm9yRWFjaChrZXk9PntpZihrZXk9PT0naHJlZicpe2lmKHByb3BzW2tleV09PW51bGx8fHR5cGVvZiBwcm9wc1trZXldIT09J3N0cmluZycmJnR5cGVvZiBwcm9wc1trZXldIT09J29iamVjdCcpe3Rocm93IGNyZWF0ZVByb3BFcnJvcih7a2V5LGV4cGVjdGVkOidgc3RyaW5nYCBvciBgb2JqZWN0YCcsYWN0dWFsOnByb3BzW2tleV09PT1udWxsPydudWxsJzp0eXBlb2YgcHJvcHNba2V5XX0pO319ZWxzZXsvLyBUeXBlU2NyaXB0IHRyaWNrIGZvciB0eXBlLWd1YXJkaW5nOlxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xuY29uc3QgXz1rZXk7fX0pOy8vIFR5cGVTY3JpcHQgdHJpY2sgZm9yIHR5cGUtZ3VhcmRpbmc6XG5jb25zdCBvcHRpb25hbFByb3BzR3VhcmQ9e2FzOnRydWUscmVwbGFjZTp0cnVlLHNjcm9sbDp0cnVlLHNoYWxsb3c6dHJ1ZSxwYXNzSHJlZjp0cnVlLHByZWZldGNoOnRydWUsbG9jYWxlOnRydWV9O2NvbnN0IG9wdGlvbmFsUHJvcHM9T2JqZWN0LmtleXMob3B0aW9uYWxQcm9wc0d1YXJkKTtvcHRpb25hbFByb3BzLmZvckVhY2goa2V5PT57Y29uc3QgdmFsVHlwZT10eXBlb2YgcHJvcHNba2V5XTtpZihrZXk9PT0nYXMnKXtpZihwcm9wc1trZXldJiZ2YWxUeXBlIT09J3N0cmluZycmJnZhbFR5cGUhPT0nb2JqZWN0Jyl7dGhyb3cgY3JlYXRlUHJvcEVycm9yKHtrZXksZXhwZWN0ZWQ6J2BzdHJpbmdgIG9yIGBvYmplY3RgJyxhY3R1YWw6dmFsVHlwZX0pO319ZWxzZSBpZihrZXk9PT0nbG9jYWxlJyl7aWYocHJvcHNba2V5XSYmdmFsVHlwZSE9PSdzdHJpbmcnKXt0aHJvdyBjcmVhdGVQcm9wRXJyb3Ioe2tleSxleHBlY3RlZDonYHN0cmluZ2AnLGFjdHVhbDp2YWxUeXBlfSk7fX1lbHNlIGlmKGtleT09PSdyZXBsYWNlJ3x8a2V5PT09J3Njcm9sbCd8fGtleT09PSdzaGFsbG93J3x8a2V5PT09J3Bhc3NIcmVmJ3x8a2V5PT09J3ByZWZldGNoJyl7aWYocHJvcHNba2V5XSE9bnVsbCYmdmFsVHlwZSE9PSdib29sZWFuJyl7dGhyb3cgY3JlYXRlUHJvcEVycm9yKHtrZXksZXhwZWN0ZWQ6J2Bib29sZWFuYCcsYWN0dWFsOnZhbFR5cGV9KTt9fWVsc2V7Ly8gVHlwZVNjcmlwdCB0cmljayBmb3IgdHlwZS1ndWFyZGluZzpcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnNcbmNvbnN0IF89a2V5O319KTsvLyBUaGlzIGhvb2sgaXMgaW4gYSBjb25kaXRpb25hbCBidXQgdGhhdCBpcyBvayBiZWNhdXNlIGBwcm9jZXNzLmVudi5OT0RFX0VOVmAgbmV2ZXIgY2hhbmdlc1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWhvb2tzL3J1bGVzLW9mLWhvb2tzXG5jb25zdCBoYXNXYXJuZWQ9X3JlYWN0LmRlZmF1bHQudXNlUmVmKGZhbHNlKTtpZihwcm9wcy5wcmVmZXRjaCYmIWhhc1dhcm5lZC5jdXJyZW50KXtoYXNXYXJuZWQuY3VycmVudD10cnVlO2NvbnNvbGUud2FybignTmV4dC5qcyBhdXRvLXByZWZldGNoZXMgYXV0b21hdGljYWxseSBiYXNlZCBvbiB2aWV3cG9ydC4gVGhlIHByZWZldGNoIGF0dHJpYnV0ZSBpcyBubyBsb25nZXIgbmVlZGVkLiBNb3JlOiBodHRwczovL25leHRqcy5vcmcvZG9jcy9tZXNzYWdlcy9wcmVmZXRjaC10cnVlLWRlcHJlY2F0ZWQnKTt9fWNvbnN0IHA9cHJvcHMucHJlZmV0Y2ghPT1mYWxzZTtjb25zdCByb3V0ZXI9KDAsX3JvdXRlcjIudXNlUm91dGVyKSgpO2NvbnN0e2hyZWYsYXN9PV9yZWFjdC5kZWZhdWx0LnVzZU1lbW8oKCk9Pntjb25zdFtyZXNvbHZlZEhyZWYscmVzb2x2ZWRBc109KDAsX3JvdXRlci5yZXNvbHZlSHJlZikocm91dGVyLHByb3BzLmhyZWYsdHJ1ZSk7cmV0dXJue2hyZWY6cmVzb2x2ZWRIcmVmLGFzOnByb3BzLmFzPygwLF9yb3V0ZXIucmVzb2x2ZUhyZWYpKHJvdXRlcixwcm9wcy5hcyk6cmVzb2x2ZWRBc3x8cmVzb2x2ZWRIcmVmfTt9LFtyb3V0ZXIscHJvcHMuaHJlZixwcm9wcy5hc10pO2xldHtjaGlsZHJlbixyZXBsYWNlLHNoYWxsb3csc2Nyb2xsLGxvY2FsZX09cHJvcHM7Ly8gRGVwcmVjYXRlZC4gV2FybmluZyBzaG93biBieSBwcm9wVHlwZSBjaGVjay4gSWYgdGhlIGNoaWxkcmVuIHByb3ZpZGVkIGlzIGEgc3RyaW5nICg8TGluaz5leGFtcGxlPC9MaW5rPikgd2Ugd3JhcCBpdCBpbiBhbiA8YT4gdGFnXG5pZih0eXBlb2YgY2hpbGRyZW49PT0nc3RyaW5nJyl7Y2hpbGRyZW49LyojX19QVVJFX18qL19yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsbnVsbCxjaGlsZHJlbik7fS8vIFRoaXMgd2lsbCByZXR1cm4gdGhlIGZpcnN0IGNoaWxkLCBpZiBtdWx0aXBsZSBhcmUgcHJvdmlkZWQgaXQgd2lsbCB0aHJvdyBhbiBlcnJvclxubGV0IGNoaWxkO2lmKHByb2Nlc3MuZW52Lk5PREVfRU5WPT09J2RldmVsb3BtZW50Jyl7dHJ5e2NoaWxkPV9yZWFjdC5DaGlsZHJlbi5vbmx5KGNoaWxkcmVuKTt9Y2F0Y2goZXJyKXt0aHJvdyBuZXcgRXJyb3IoYE11bHRpcGxlIGNoaWxkcmVuIHdlcmUgcGFzc2VkIHRvIDxMaW5rPiB3aXRoIFxcYGhyZWZcXGAgb2YgXFxgJHtwcm9wcy5ocmVmfVxcYCBidXQgb25seSBvbmUgY2hpbGQgaXMgc3VwcG9ydGVkIGh0dHBzOi8vbmV4dGpzLm9yZy9kb2NzL21lc3NhZ2VzL2xpbmstbXVsdGlwbGUtY2hpbGRyZW5gKyh0eXBlb2Ygd2luZG93IT09J3VuZGVmaW5lZCc/XCJcXG5PcGVuIHlvdXIgYnJvd3NlcidzIGNvbnNvbGUgdG8gdmlldyB0aGUgQ29tcG9uZW50IHN0YWNrIHRyYWNlLlwiOicnKSk7fX1lbHNle2NoaWxkPV9yZWFjdC5DaGlsZHJlbi5vbmx5KGNoaWxkcmVuKTt9Y29uc3QgY2hpbGRSZWY9Y2hpbGQmJnR5cGVvZiBjaGlsZD09PSdvYmplY3QnJiZjaGlsZC5yZWY7Y29uc3Rbc2V0SW50ZXJzZWN0aW9uUmVmLGlzVmlzaWJsZV09KDAsX3VzZUludGVyc2VjdGlvbi51c2VJbnRlcnNlY3Rpb24pKHtyb290TWFyZ2luOicyMDBweCd9KTtjb25zdCBzZXRSZWY9X3JlYWN0LmRlZmF1bHQudXNlQ2FsbGJhY2soZWw9PntzZXRJbnRlcnNlY3Rpb25SZWYoZWwpO2lmKGNoaWxkUmVmKXtpZih0eXBlb2YgY2hpbGRSZWY9PT0nZnVuY3Rpb24nKWNoaWxkUmVmKGVsKTtlbHNlIGlmKHR5cGVvZiBjaGlsZFJlZj09PSdvYmplY3QnKXtjaGlsZFJlZi5jdXJyZW50PWVsO319fSxbY2hpbGRSZWYsc2V0SW50ZXJzZWN0aW9uUmVmXSk7KDAsX3JlYWN0LnVzZUVmZmVjdCkoKCk9Pntjb25zdCBzaG91bGRQcmVmZXRjaD1pc1Zpc2libGUmJnAmJigwLF9yb3V0ZXIuaXNMb2NhbFVSTCkoaHJlZik7Y29uc3QgY3VyTG9jYWxlPXR5cGVvZiBsb2NhbGUhPT0ndW5kZWZpbmVkJz9sb2NhbGU6cm91dGVyJiZyb3V0ZXIubG9jYWxlO2NvbnN0IGlzUHJlZmV0Y2hlZD1wcmVmZXRjaGVkW2hyZWYrJyUnK2FzKyhjdXJMb2NhbGU/JyUnK2N1ckxvY2FsZTonJyldO2lmKHNob3VsZFByZWZldGNoJiYhaXNQcmVmZXRjaGVkKXtwcmVmZXRjaChyb3V0ZXIsaHJlZixhcyx7bG9jYWxlOmN1ckxvY2FsZX0pO319LFthcyxocmVmLGlzVmlzaWJsZSxsb2NhbGUscCxyb3V0ZXJdKTtjb25zdCBjaGlsZFByb3BzPXtyZWY6c2V0UmVmLG9uQ2xpY2s6ZT0+e2lmKGNoaWxkLnByb3BzJiZ0eXBlb2YgY2hpbGQucHJvcHMub25DbGljaz09PSdmdW5jdGlvbicpe2NoaWxkLnByb3BzLm9uQ2xpY2soZSk7fWlmKCFlLmRlZmF1bHRQcmV2ZW50ZWQpe2xpbmtDbGlja2VkKGUscm91dGVyLGhyZWYsYXMscmVwbGFjZSxzaGFsbG93LHNjcm9sbCxsb2NhbGUpO319fTtjaGlsZFByb3BzLm9uTW91c2VFbnRlcj1lPT57aWYoISgwLF9yb3V0ZXIuaXNMb2NhbFVSTCkoaHJlZikpcmV0dXJuO2lmKGNoaWxkLnByb3BzJiZ0eXBlb2YgY2hpbGQucHJvcHMub25Nb3VzZUVudGVyPT09J2Z1bmN0aW9uJyl7Y2hpbGQucHJvcHMub25Nb3VzZUVudGVyKGUpO31wcmVmZXRjaChyb3V0ZXIsaHJlZixhcyx7cHJpb3JpdHk6dHJ1ZX0pO307Ly8gSWYgY2hpbGQgaXMgYW4gPGE+IHRhZyBhbmQgZG9lc24ndCBoYXZlIGEgaHJlZiBhdHRyaWJ1dGUsIG9yIGlmIHRoZSAncGFzc0hyZWYnIHByb3BlcnR5IGlzXG4vLyBkZWZpbmVkLCB3ZSBzcGVjaWZ5IHRoZSBjdXJyZW50ICdocmVmJywgc28gdGhhdCByZXBldGl0aW9uIGlzIG5vdCBuZWVkZWQgYnkgdGhlIHVzZXJcbmlmKHByb3BzLnBhc3NIcmVmfHxjaGlsZC50eXBlPT09J2EnJiYhKCdocmVmJ2luIGNoaWxkLnByb3BzKSl7Y29uc3QgY3VyTG9jYWxlPXR5cGVvZiBsb2NhbGUhPT0ndW5kZWZpbmVkJz9sb2NhbGU6cm91dGVyJiZyb3V0ZXIubG9jYWxlOy8vIHdlIG9ubHkgcmVuZGVyIGRvbWFpbiBsb2NhbGVzIGlmIHdlIGFyZSBjdXJyZW50bHkgb24gYSBkb21haW4gbG9jYWxlXG4vLyBzbyB0aGF0IGxvY2FsZSBsaW5rcyBhcmUgc3RpbGwgdmlzaXRhYmxlIGluIGRldmVsb3BtZW50L3ByZXZpZXcgZW52c1xuY29uc3QgbG9jYWxlRG9tYWluPXJvdXRlciYmcm91dGVyLmlzTG9jYWxlRG9tYWluJiYoMCxfcm91dGVyLmdldERvbWFpbkxvY2FsZSkoYXMsY3VyTG9jYWxlLHJvdXRlciYmcm91dGVyLmxvY2FsZXMscm91dGVyJiZyb3V0ZXIuZG9tYWluTG9jYWxlcyk7Y2hpbGRQcm9wcy5ocmVmPWxvY2FsZURvbWFpbnx8KDAsX3JvdXRlci5hZGRCYXNlUGF0aCkoKDAsX3JvdXRlci5hZGRMb2NhbGUpKGFzLGN1ckxvY2FsZSxyb3V0ZXImJnJvdXRlci5kZWZhdWx0TG9jYWxlKSk7fXJldHVybi8qI19fUFVSRV9fKi9fcmVhY3QuZGVmYXVsdC5jbG9uZUVsZW1lbnQoY2hpbGQsY2hpbGRQcm9wcyk7fXZhciBfZGVmYXVsdD1MaW5rO2V4cG9ydHMuZGVmYXVsdD1fZGVmYXVsdDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxpbmsuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7ZXhwb3J0cy5fX2VzTW9kdWxlPXRydWU7ZXhwb3J0cy5yZW1vdmVQYXRoVHJhaWxpbmdTbGFzaD1yZW1vdmVQYXRoVHJhaWxpbmdTbGFzaDtleHBvcnRzLm5vcm1hbGl6ZVBhdGhUcmFpbGluZ1NsYXNoPXZvaWQgMDsvKipcbiAqIFJlbW92ZXMgdGhlIHRyYWlsaW5nIHNsYXNoIG9mIGEgcGF0aCBpZiB0aGVyZSBpcyBvbmUuIFByZXNlcnZlcyB0aGUgcm9vdCBwYXRoIGAvYC5cbiAqL2Z1bmN0aW9uIHJlbW92ZVBhdGhUcmFpbGluZ1NsYXNoKHBhdGgpe3JldHVybiBwYXRoLmVuZHNXaXRoKCcvJykmJnBhdGghPT0nLyc/cGF0aC5zbGljZSgwLC0xKTpwYXRoO30vKipcbiAqIE5vcm1hbGl6ZXMgdGhlIHRyYWlsaW5nIHNsYXNoIG9mIGEgcGF0aCBhY2NvcmRpbmcgdG8gdGhlIGB0cmFpbGluZ1NsYXNoYCBvcHRpb25cbiAqIGluIGBuZXh0LmNvbmZpZy5qc2AuXG4gKi9jb25zdCBub3JtYWxpemVQYXRoVHJhaWxpbmdTbGFzaD1wcm9jZXNzLmVudi5fX05FWFRfVFJBSUxJTkdfU0xBU0g/cGF0aD0+e2lmKC9cXC5bXi9dK1xcLz8kLy50ZXN0KHBhdGgpKXtyZXR1cm4gcmVtb3ZlUGF0aFRyYWlsaW5nU2xhc2gocGF0aCk7fWVsc2UgaWYocGF0aC5lbmRzV2l0aCgnLycpKXtyZXR1cm4gcGF0aDt9ZWxzZXtyZXR1cm4gcGF0aCsnLyc7fX06cmVtb3ZlUGF0aFRyYWlsaW5nU2xhc2g7ZXhwb3J0cy5ub3JtYWxpemVQYXRoVHJhaWxpbmdTbGFzaD1ub3JtYWxpemVQYXRoVHJhaWxpbmdTbGFzaDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW5vcm1hbGl6ZS10cmFpbGluZy1zbGFzaC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtleHBvcnRzLl9fZXNNb2R1bGU9dHJ1ZTtleHBvcnRzLmNhbmNlbElkbGVDYWxsYmFjaz1leHBvcnRzLnJlcXVlc3RJZGxlQ2FsbGJhY2s9dm9pZCAwO2NvbnN0IHJlcXVlc3RJZGxlQ2FsbGJhY2s9dHlwZW9mIHNlbGYhPT0ndW5kZWZpbmVkJyYmc2VsZi5yZXF1ZXN0SWRsZUNhbGxiYWNrfHxmdW5jdGlvbihjYil7bGV0IHN0YXJ0PURhdGUubm93KCk7cmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtjYih7ZGlkVGltZW91dDpmYWxzZSx0aW1lUmVtYWluaW5nOmZ1bmN0aW9uKCl7cmV0dXJuIE1hdGgubWF4KDAsNTAtKERhdGUubm93KCktc3RhcnQpKTt9fSk7fSwxKTt9O2V4cG9ydHMucmVxdWVzdElkbGVDYWxsYmFjaz1yZXF1ZXN0SWRsZUNhbGxiYWNrO2NvbnN0IGNhbmNlbElkbGVDYWxsYmFjaz10eXBlb2Ygc2VsZiE9PSd1bmRlZmluZWQnJiZzZWxmLmNhbmNlbElkbGVDYWxsYmFja3x8ZnVuY3Rpb24oaWQpe3JldHVybiBjbGVhclRpbWVvdXQoaWQpO307ZXhwb3J0cy5jYW5jZWxJZGxlQ2FsbGJhY2s9Y2FuY2VsSWRsZUNhbGxiYWNrO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cmVxdWVzdC1pZGxlLWNhbGxiYWNrLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO3ZhciBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0PXJlcXVpcmUoXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL2ludGVyb3BSZXF1aXJlRGVmYXVsdFwiKTtleHBvcnRzLl9fZXNNb2R1bGU9dHJ1ZTtleHBvcnRzLm1hcmtBc3NldEVycm9yPW1hcmtBc3NldEVycm9yO2V4cG9ydHMuaXNBc3NldEVycm9yPWlzQXNzZXRFcnJvcjtleHBvcnRzLmdldENsaWVudEJ1aWxkTWFuaWZlc3Q9Z2V0Q2xpZW50QnVpbGRNYW5pZmVzdDtleHBvcnRzLmRlZmF1bHQ9dm9pZCAwO3ZhciBfZ2V0QXNzZXRQYXRoRnJvbVJvdXRlPV9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uL25leHQtc2VydmVyL2xpYi9yb3V0ZXIvdXRpbHMvZ2V0LWFzc2V0LXBhdGgtZnJvbS1yb3V0ZVwiKSk7dmFyIF9yZXF1ZXN0SWRsZUNhbGxiYWNrPXJlcXVpcmUoXCIuL3JlcXVlc3QtaWRsZS1jYWxsYmFja1wiKTsvLyAzLjhzIHdhcyBhcmJpdHJhcmlseSBjaG9zZW4gYXMgaXQncyB3aGF0IGh0dHBzOi8vd2ViLmRldi9pbnRlcmFjdGl2ZVxuLy8gY29uc2lkZXJzIGFzIFwiR29vZFwiIHRpbWUtdG8taW50ZXJhY3RpdmUuIFdlIG11c3QgYXNzdW1lIHNvbWV0aGluZyB3ZW50XG4vLyB3cm9uZyBiZXlvbmQgdGhpcyBwb2ludCwgYW5kIHRoZW4gZmFsbC1iYWNrIHRvIGEgZnVsbCBwYWdlIHRyYW5zaXRpb24gdG9cbi8vIHNob3cgdGhlIHVzZXIgc29tZXRoaW5nIG9mIHZhbHVlLlxuY29uc3QgTVNfTUFYX0lETEVfREVMQVk9MzgwMDtmdW5jdGlvbiB3aXRoRnV0dXJlKGtleSxtYXAsZ2VuZXJhdG9yKXtsZXQgZW50cnk9bWFwLmdldChrZXkpO2lmKGVudHJ5KXtpZignZnV0dXJlJ2luIGVudHJ5KXtyZXR1cm4gZW50cnkuZnV0dXJlO31yZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGVudHJ5KTt9bGV0IHJlc29sdmVyO2NvbnN0IHByb209bmV3IFByb21pc2UocmVzb2x2ZT0+e3Jlc29sdmVyPXJlc29sdmU7fSk7bWFwLnNldChrZXksZW50cnk9e3Jlc29sdmU6cmVzb2x2ZXIsZnV0dXJlOnByb219KTtyZXR1cm4gZ2VuZXJhdG9yPy8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZXF1ZW5jZXNcbmdlbmVyYXRvcigpLnRoZW4odmFsdWU9PihyZXNvbHZlcih2YWx1ZSksdmFsdWUpKTpwcm9tO31mdW5jdGlvbiBoYXNQcmVmZXRjaChsaW5rKXt0cnl7bGluaz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW5rJyk7cmV0dXJuKC8vIGRldGVjdCBJRTExIHNpbmNlIGl0IHN1cHBvcnRzIHByZWZldGNoIGJ1dCBpc24ndCBkZXRlY3RlZFxuLy8gd2l0aCByZWxMaXN0LnN1cHBvcnRcbiEhd2luZG93Lk1TSW5wdXRNZXRob2RDb250ZXh0JiYhIWRvY3VtZW50LmRvY3VtZW50TW9kZXx8bGluay5yZWxMaXN0LnN1cHBvcnRzKCdwcmVmZXRjaCcpKTt9Y2F0Y2goX3VudXNlZCl7cmV0dXJuIGZhbHNlO319Y29uc3QgY2FuUHJlZmV0Y2g9aGFzUHJlZmV0Y2goKTtmdW5jdGlvbiBwcmVmZXRjaFZpYURvbShocmVmLGFzLGxpbmspe3JldHVybiBuZXcgUHJvbWlzZSgocmVzLHJlaik9PntpZihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBsaW5rW3JlbD1cInByZWZldGNoXCJdW2hyZWZePVwiJHtocmVmfVwiXWApKXtyZXR1cm4gcmVzKCk7fWxpbms9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGluaycpOy8vIFRoZSBvcmRlciBvZiBwcm9wZXJ0eSBhc3NpZ25tZW50IGhlcmUgaXMgaW50ZW50aW9uYWw6XG5pZihhcylsaW5rLmFzPWFzO2xpbmsucmVsPWBwcmVmZXRjaGA7bGluay5jcm9zc09yaWdpbj1wcm9jZXNzLmVudi5fX05FWFRfQ1JPU1NfT1JJR0lOO2xpbmsub25sb2FkPXJlcztsaW5rLm9uZXJyb3I9cmVqOy8vIGBocmVmYCBzaG91bGQgYWx3YXlzIGJlIGxhc3Q6XG5saW5rLmhyZWY9aHJlZjtkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKGxpbmspO30pO31jb25zdCBBU1NFVF9MT0FEX0VSUk9SPVN5bWJvbCgnQVNTRVRfTE9BRF9FUlJPUicpOy8vIFRPRE86IHVuZXhwb3J0XG5mdW5jdGlvbiBtYXJrQXNzZXRFcnJvcihlcnIpe3JldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXJyLEFTU0VUX0xPQURfRVJST1Ise30pO31mdW5jdGlvbiBpc0Fzc2V0RXJyb3IoZXJyKXtyZXR1cm4gZXJyJiZBU1NFVF9MT0FEX0VSUk9SIGluIGVycjt9ZnVuY3Rpb24gYXBwZW5kU2NyaXB0KHNyYyxzY3JpcHQpe3JldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSxyZWplY3QpPT57c2NyaXB0PWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpOy8vIFRoZSBvcmRlciBvZiBwcm9wZXJ0eSBhc3NpZ25tZW50IGhlcmUgaXMgaW50ZW50aW9uYWwuXG4vLyAxLiBTZXR1cCBzdWNjZXNzL2ZhaWx1cmUgaG9va3MgaW4gY2FzZSB0aGUgYnJvd3NlciBzeW5jaHJvbm91c2x5XG4vLyAgICBleGVjdXRlcyB3aGVuIGBzcmNgIGlzIHNldC5cbnNjcmlwdC5vbmxvYWQ9cmVzb2x2ZTtzY3JpcHQub25lcnJvcj0oKT0+cmVqZWN0KG1hcmtBc3NldEVycm9yKG5ldyBFcnJvcihgRmFpbGVkIHRvIGxvYWQgc2NyaXB0OiAke3NyY31gKSkpOy8vIDIuIENvbmZpZ3VyZSB0aGUgY3Jvc3Mtb3JpZ2luIGF0dHJpYnV0ZSBiZWZvcmUgc2V0dGluZyBgc3JjYCBpbiBjYXNlIHRoZVxuLy8gICAgYnJvd3NlciBiZWdpbnMgdG8gZmV0Y2guXG5zY3JpcHQuY3Jvc3NPcmlnaW49cHJvY2Vzcy5lbnYuX19ORVhUX0NST1NTX09SSUdJTjsvLyAzLiBGaW5hbGx5LCBzZXQgdGhlIHNvdXJjZSBhbmQgaW5qZWN0IGludG8gdGhlIERPTSBpbiBjYXNlIHRoZSBjaGlsZFxuLy8gICAgbXVzdCBiZSBhcHBlbmRlZCBmb3IgZmV0Y2hpbmcgdG8gc3RhcnQuXG5zY3JpcHQuc3JjPXNyYztkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7fSk7fS8vIFJlc29sdmUgYSBwcm9taXNlIHRoYXQgdGltZXMgb3V0IGFmdGVyIGdpdmVuIGFtb3VudCBvZiBtaWxsaXNlY29uZHMuXG5mdW5jdGlvbiByZXNvbHZlUHJvbWlzZVdpdGhUaW1lb3V0KHAsbXMsZXJyKXtyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUscmVqZWN0KT0+e2xldCBjYW5jZWxsZWQ9ZmFsc2U7cC50aGVuKHI9PnsvLyBSZXNvbHZlZCwgY2FuY2VsIHRoZSB0aW1lb3V0XG5jYW5jZWxsZWQ9dHJ1ZTtyZXNvbHZlKHIpO30pLmNhdGNoKHJlamVjdCk7KDAsX3JlcXVlc3RJZGxlQ2FsbGJhY2sucmVxdWVzdElkbGVDYWxsYmFjaykoKCk9PnNldFRpbWVvdXQoKCk9PntpZighY2FuY2VsbGVkKXtyZWplY3QoZXJyKTt9fSxtcykpO30pO30vLyBUT0RPOiBzdG9wIGV4cG9ydGluZyBvciBjYWNoZSB0aGUgZmFpbHVyZVxuLy8gSXQnZCBiZSBiZXN0IHRvIHN0b3AgZXhwb3J0aW5nIHRoaXMuIEl0J3MgYW4gaW1wbGVtZW50YXRpb24gZGV0YWlsLiBXZSdyZVxuLy8gb25seSBleHBvcnRpbmcgaXQgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsdHkgd2l0aCB0aGUgYHBhZ2UtbG9hZGVyYC5cbi8vIE9ubHkgY2FjaGUgdGhpcyByZXNwb25zZSBhcyBhIGxhc3QgcmVzb3J0IGlmIHdlIGNhbm5vdCBlbGltaW5hdGUgYWxsIG90aGVyXG4vLyBjb2RlIGJyYW5jaGVzIHRoYXQgdXNlIHRoZSBCdWlsZCBNYW5pZmVzdCBDYWxsYmFjayBhbmQgcHVzaCB0aGVtIHRocm91Z2hcbi8vIHRoZSBSb3V0ZSBMb2FkZXIgaW50ZXJmYWNlLlxuZnVuY3Rpb24gZ2V0Q2xpZW50QnVpbGRNYW5pZmVzdCgpe2lmKHNlbGYuX19CVUlMRF9NQU5JRkVTVCl7cmV0dXJuIFByb21pc2UucmVzb2x2ZShzZWxmLl9fQlVJTERfTUFOSUZFU1QpO31jb25zdCBvbkJ1aWxkTWFuaWZlc3Q9bmV3IFByb21pc2UocmVzb2x2ZT0+ey8vIE1hbmRhdG9yeSBiZWNhdXNlIHRoaXMgaXMgbm90IGNvbmN1cnJlbnQgc2FmZTpcbmNvbnN0IGNiPXNlbGYuX19CVUlMRF9NQU5JRkVTVF9DQjtzZWxmLl9fQlVJTERfTUFOSUZFU1RfQ0I9KCk9PntyZXNvbHZlKHNlbGYuX19CVUlMRF9NQU5JRkVTVCk7Y2ImJmNiKCk7fTt9KTtyZXR1cm4gcmVzb2x2ZVByb21pc2VXaXRoVGltZW91dChvbkJ1aWxkTWFuaWZlc3QsTVNfTUFYX0lETEVfREVMQVksbWFya0Fzc2V0RXJyb3IobmV3IEVycm9yKCdGYWlsZWQgdG8gbG9hZCBjbGllbnQgYnVpbGQgbWFuaWZlc3QnKSkpO31mdW5jdGlvbiBnZXRGaWxlc0ZvclJvdXRlKGFzc2V0UHJlZml4LHJvdXRlKXtpZihwcm9jZXNzLmVudi5OT0RFX0VOVj09PSdkZXZlbG9wbWVudCcpe3JldHVybiBQcm9taXNlLnJlc29sdmUoe3NjcmlwdHM6W2Fzc2V0UHJlZml4KycvX25leHQvc3RhdGljL2NodW5rcy9wYWdlcycrZW5jb2RlVVJJKCgwLF9nZXRBc3NldFBhdGhGcm9tUm91dGUuZGVmYXVsdCkocm91dGUsJy5qcycpKV0sLy8gU3R5bGVzIGFyZSBoYW5kbGVkIGJ5IGBzdHlsZS1sb2FkZXJgIGluIGRldmVsb3BtZW50OlxuY3NzOltdfSk7fXJldHVybiBnZXRDbGllbnRCdWlsZE1hbmlmZXN0KCkudGhlbihtYW5pZmVzdD0+e2lmKCEocm91dGUgaW4gbWFuaWZlc3QpKXt0aHJvdyBtYXJrQXNzZXRFcnJvcihuZXcgRXJyb3IoYEZhaWxlZCB0byBsb29rdXAgcm91dGU6ICR7cm91dGV9YCkpO31jb25zdCBhbGxGaWxlcz1tYW5pZmVzdFtyb3V0ZV0ubWFwKGVudHJ5PT5hc3NldFByZWZpeCsnL19uZXh0LycrZW5jb2RlVVJJKGVudHJ5KSk7cmV0dXJue3NjcmlwdHM6YWxsRmlsZXMuZmlsdGVyKHY9PnYuZW5kc1dpdGgoJy5qcycpKSxjc3M6YWxsRmlsZXMuZmlsdGVyKHY9PnYuZW5kc1dpdGgoJy5jc3MnKSl9O30pO31mdW5jdGlvbiBjcmVhdGVSb3V0ZUxvYWRlcihhc3NldFByZWZpeCl7Y29uc3QgZW50cnlwb2ludHM9bmV3IE1hcCgpO2NvbnN0IGxvYWRlZFNjcmlwdHM9bmV3IE1hcCgpO2NvbnN0IHN0eWxlU2hlZXRzPW5ldyBNYXAoKTtjb25zdCByb3V0ZXM9bmV3IE1hcCgpO2Z1bmN0aW9uIG1heWJlRXhlY3V0ZVNjcmlwdChzcmMpe2xldCBwcm9tPWxvYWRlZFNjcmlwdHMuZ2V0KHNyYyk7aWYocHJvbSl7cmV0dXJuIHByb207fS8vIFNraXAgZXhlY3V0aW5nIHNjcmlwdCBpZiBpdCdzIGFscmVhZHkgaW4gdGhlIERPTTpcbmlmKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYHNjcmlwdFtzcmNePVwiJHtzcmN9XCJdYCkpe3JldHVybiBQcm9taXNlLnJlc29sdmUoKTt9bG9hZGVkU2NyaXB0cy5zZXQoc3JjLHByb209YXBwZW5kU2NyaXB0KHNyYykpO3JldHVybiBwcm9tO31mdW5jdGlvbiBmZXRjaFN0eWxlU2hlZXQoaHJlZil7bGV0IHByb209c3R5bGVTaGVldHMuZ2V0KGhyZWYpO2lmKHByb20pe3JldHVybiBwcm9tO31zdHlsZVNoZWV0cy5zZXQoaHJlZixwcm9tPWZldGNoKGhyZWYpLnRoZW4ocmVzPT57aWYoIXJlcy5vayl7dGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gbG9hZCBzdHlsZXNoZWV0OiAke2hyZWZ9YCk7fXJldHVybiByZXMudGV4dCgpLnRoZW4odGV4dD0+KHtocmVmOmhyZWYsY29udGVudDp0ZXh0fSkpO30pLmNhdGNoKGVycj0+e3Rocm93IG1hcmtBc3NldEVycm9yKGVycik7fSkpO3JldHVybiBwcm9tO31yZXR1cm57d2hlbkVudHJ5cG9pbnQocm91dGUpe3JldHVybiB3aXRoRnV0dXJlKHJvdXRlLGVudHJ5cG9pbnRzKTt9LG9uRW50cnlwb2ludChyb3V0ZSxleGVjdXRlKXtQcm9taXNlLnJlc29sdmUoZXhlY3V0ZSkudGhlbihmbj0+Zm4oKSkudGhlbihleHBvcnRzPT4oe2NvbXBvbmVudDpleHBvcnRzJiZleHBvcnRzLmRlZmF1bHR8fGV4cG9ydHMsZXhwb3J0czpleHBvcnRzfSksZXJyPT4oe2Vycm9yOmVycn0pKS50aGVuKGlucHV0PT57Y29uc3Qgb2xkPWVudHJ5cG9pbnRzLmdldChyb3V0ZSk7ZW50cnlwb2ludHMuc2V0KHJvdXRlLGlucHV0KTtpZihvbGQmJidyZXNvbHZlJ2luIG9sZClvbGQucmVzb2x2ZShpbnB1dCk7fSk7fSxsb2FkUm91dGUocm91dGUscHJlZmV0Y2gpe3JldHVybiB3aXRoRnV0dXJlKHJvdXRlLHJvdXRlcywoKT0+e3JldHVybiByZXNvbHZlUHJvbWlzZVdpdGhUaW1lb3V0KGdldEZpbGVzRm9yUm91dGUoYXNzZXRQcmVmaXgscm91dGUpLnRoZW4oKHtzY3JpcHRzLGNzc30pPT57cmV0dXJuIFByb21pc2UuYWxsKFtlbnRyeXBvaW50cy5oYXMocm91dGUpP1tdOlByb21pc2UuYWxsKHNjcmlwdHMubWFwKG1heWJlRXhlY3V0ZVNjcmlwdCkpLFByb21pc2UuYWxsKGNzcy5tYXAoZmV0Y2hTdHlsZVNoZWV0KSldKTt9KS50aGVuKHJlcz0+e3JldHVybiB0aGlzLndoZW5FbnRyeXBvaW50KHJvdXRlKS50aGVuKGVudHJ5cG9pbnQ9Pih7ZW50cnlwb2ludCxzdHlsZXM6cmVzWzFdfSkpO30pLE1TX01BWF9JRExFX0RFTEFZLG1hcmtBc3NldEVycm9yKG5ldyBFcnJvcihgUm91dGUgZGlkIG5vdCBjb21wbGV0ZSBsb2FkaW5nOiAke3JvdXRlfWApKSkudGhlbigoe2VudHJ5cG9pbnQsc3R5bGVzfSk9Pntjb25zdCByZXM9T2JqZWN0LmFzc2lnbih7c3R5bGVzOnN0eWxlc30sZW50cnlwb2ludCk7cmV0dXJuJ2Vycm9yJ2luIGVudHJ5cG9pbnQ/ZW50cnlwb2ludDpyZXM7fSkuY2F0Y2goZXJyPT57aWYocHJlZmV0Y2gpey8vIHdlIGRvbid0IHdhbnQgdG8gY2FjaGUgZXJyb3JzIGR1cmluZyBwcmVmZXRjaFxudGhyb3cgZXJyO31yZXR1cm57ZXJyb3I6ZXJyfTt9KTt9KTt9LHByZWZldGNoKHJvdXRlKXsvLyBodHRwczovL2dpdGh1Yi5jb20vR29vZ2xlQ2hyb21lTGFicy9xdWlja2xpbmsvYmxvYi80NTNhNjYxZmExZmE5NDBlMmQyZTA0NDQ1MjM5OGUzOGM2N2E5OGZiL3NyYy9pbmRleC5tanMjTDExNS1MMTE4XG4vLyBMaWNlbnNlOiBBcGFjaGUgMi4wXG5sZXQgY247aWYoY249bmF2aWdhdG9yLmNvbm5lY3Rpb24pey8vIERvbid0IHByZWZldGNoIGlmIHVzaW5nIDJHIG9yIGlmIFNhdmUtRGF0YSBpcyBlbmFibGVkLlxuaWYoY24uc2F2ZURhdGF8fC8yZy8udGVzdChjbi5lZmZlY3RpdmVUeXBlKSlyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7fXJldHVybiBnZXRGaWxlc0ZvclJvdXRlKGFzc2V0UHJlZml4LHJvdXRlKS50aGVuKG91dHB1dD0+UHJvbWlzZS5hbGwoY2FuUHJlZmV0Y2g/b3V0cHV0LnNjcmlwdHMubWFwKHNjcmlwdD0+cHJlZmV0Y2hWaWFEb20oc2NyaXB0LCdzY3JpcHQnKSk6W10pKS50aGVuKCgpPT57KDAsX3JlcXVlc3RJZGxlQ2FsbGJhY2sucmVxdWVzdElkbGVDYWxsYmFjaykoKCk9PnRoaXMubG9hZFJvdXRlKHJvdXRlLHRydWUpLmNhdGNoKCgpPT57fSkpO30pLmNhdGNoKC8vIHN3YWxsb3cgcHJlZmV0Y2ggZXJyb3JzXG4oKT0+e30pO319O312YXIgX2RlZmF1bHQ9Y3JlYXRlUm91dGVMb2FkZXI7ZXhwb3J0cy5kZWZhdWx0PV9kZWZhdWx0O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cm91dGUtbG9hZGVyLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO3ZhciBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZD1yZXF1aXJlKFwiQGJhYmVsL3J1bnRpbWUvaGVscGVycy9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkXCIpO3ZhciBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0PXJlcXVpcmUoXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL2ludGVyb3BSZXF1aXJlRGVmYXVsdFwiKTtleHBvcnRzLl9fZXNNb2R1bGU9dHJ1ZTtleHBvcnRzLnVzZVJvdXRlcj11c2VSb3V0ZXI7ZXhwb3J0cy5tYWtlUHVibGljUm91dGVySW5zdGFuY2U9bWFrZVB1YmxpY1JvdXRlckluc3RhbmNlO2V4cG9ydHMuY3JlYXRlUm91dGVyPWV4cG9ydHMud2l0aFJvdXRlcj1leHBvcnRzLmRlZmF1bHQ9dm9pZCAwO3ZhciBfcmVhY3Q9X2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwicmVhY3RcIikpO3ZhciBfcm91dGVyMj1faW50ZXJvcFJlcXVpcmVXaWxkY2FyZChyZXF1aXJlKFwiLi4vbmV4dC1zZXJ2ZXIvbGliL3JvdXRlci9yb3V0ZXJcIikpO2V4cG9ydHMuUm91dGVyPV9yb3V0ZXIyLmRlZmF1bHQ7ZXhwb3J0cy5OZXh0Um91dGVyPV9yb3V0ZXIyLk5leHRSb3V0ZXI7dmFyIF9yb3V0ZXJDb250ZXh0PXJlcXVpcmUoXCIuLi9uZXh0LXNlcnZlci9saWIvcm91dGVyLWNvbnRleHRcIik7dmFyIF93aXRoUm91dGVyPV9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vd2l0aC1yb3V0ZXJcIikpO2V4cG9ydHMud2l0aFJvdXRlcj1fd2l0aFJvdXRlci5kZWZhdWx0Oy8qIGdsb2JhbCB3aW5kb3cgKi9jb25zdCBzaW5nbGV0b25Sb3V0ZXI9e3JvdXRlcjpudWxsLC8vIGhvbGRzIHRoZSBhY3R1YWwgcm91dGVyIGluc3RhbmNlXG5yZWFkeUNhbGxiYWNrczpbXSxyZWFkeShjYil7aWYodGhpcy5yb3V0ZXIpcmV0dXJuIGNiKCk7aWYodHlwZW9mIHdpbmRvdyE9PSd1bmRlZmluZWQnKXt0aGlzLnJlYWR5Q2FsbGJhY2tzLnB1c2goY2IpO319fTsvLyBDcmVhdGUgcHVibGljIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMgb2YgdGhlIHJvdXRlciBpbiB0aGUgc2luZ2xldG9uUm91dGVyXG5jb25zdCB1cmxQcm9wZXJ0eUZpZWxkcz1bJ3BhdGhuYW1lJywncm91dGUnLCdxdWVyeScsJ2FzUGF0aCcsJ2NvbXBvbmVudHMnLCdpc0ZhbGxiYWNrJywnYmFzZVBhdGgnLCdsb2NhbGUnLCdsb2NhbGVzJywnZGVmYXVsdExvY2FsZScsJ2lzUmVhZHknLCdpc1ByZXZpZXcnLCdpc0xvY2FsZURvbWFpbicsJ2RvbWFpbkxvY2FsZXMnXTtjb25zdCByb3V0ZXJFdmVudHM9Wydyb3V0ZUNoYW5nZVN0YXJ0JywnYmVmb3JlSGlzdG9yeUNoYW5nZScsJ3JvdXRlQ2hhbmdlQ29tcGxldGUnLCdyb3V0ZUNoYW5nZUVycm9yJywnaGFzaENoYW5nZVN0YXJ0JywnaGFzaENoYW5nZUNvbXBsZXRlJ107Y29uc3QgY29yZU1ldGhvZEZpZWxkcz1bJ3B1c2gnLCdyZXBsYWNlJywncmVsb2FkJywnYmFjaycsJ3ByZWZldGNoJywnYmVmb3JlUG9wU3RhdGUnXTsvLyBFdmVudHMgaXMgYSBzdGF0aWMgcHJvcGVydHkgb24gdGhlIHJvdXRlciwgdGhlIHJvdXRlciBkb2Vzbid0IGhhdmUgdG8gYmUgaW5pdGlhbGl6ZWQgdG8gdXNlIGl0XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoc2luZ2xldG9uUm91dGVyLCdldmVudHMnLHtnZXQoKXtyZXR1cm4gX3JvdXRlcjIuZGVmYXVsdC5ldmVudHM7fX0pO3VybFByb3BlcnR5RmllbGRzLmZvckVhY2goZmllbGQ9PnsvLyBIZXJlIHdlIG5lZWQgdG8gdXNlIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBiZWNhdXNlIHdlIG5lZWQgdG8gcmV0dXJuXG4vLyB0aGUgcHJvcGVydHkgYXNzaWduZWQgdG8gdGhlIGFjdHVhbCByb3V0ZXJcbi8vIFRoZSB2YWx1ZSBtaWdodCBnZXQgY2hhbmdlZCBhcyB3ZSBjaGFuZ2Ugcm91dGVzIGFuZCB0aGlzIGlzIHRoZVxuLy8gcHJvcGVyIHdheSB0byBhY2Nlc3MgaXRcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShzaW5nbGV0b25Sb3V0ZXIsZmllbGQse2dldCgpe2NvbnN0IHJvdXRlcj1nZXRSb3V0ZXIoKTtyZXR1cm4gcm91dGVyW2ZpZWxkXTt9fSk7fSk7Y29yZU1ldGhvZEZpZWxkcy5mb3JFYWNoKGZpZWxkPT57Ly8gV2UgZG9uJ3QgcmVhbGx5IGtub3cgdGhlIHR5cGVzIGhlcmUsIHNvIHdlIGFkZCB0aGVtIGxhdGVyIGluc3RlYWRcbjtzaW5nbGV0b25Sb3V0ZXJbZmllbGRdPSguLi5hcmdzKT0+e2NvbnN0IHJvdXRlcj1nZXRSb3V0ZXIoKTtyZXR1cm4gcm91dGVyW2ZpZWxkXSguLi5hcmdzKTt9O30pO3JvdXRlckV2ZW50cy5mb3JFYWNoKGV2ZW50PT57c2luZ2xldG9uUm91dGVyLnJlYWR5KCgpPT57X3JvdXRlcjIuZGVmYXVsdC5ldmVudHMub24oZXZlbnQsKC4uLmFyZ3MpPT57Y29uc3QgZXZlbnRGaWVsZD1gb24ke2V2ZW50LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpfSR7ZXZlbnQuc3Vic3RyaW5nKDEpfWA7Y29uc3QgX3NpbmdsZXRvblJvdXRlcj1zaW5nbGV0b25Sb3V0ZXI7aWYoX3NpbmdsZXRvblJvdXRlcltldmVudEZpZWxkXSl7dHJ5e19zaW5nbGV0b25Sb3V0ZXJbZXZlbnRGaWVsZF0oLi4uYXJncyk7fWNhdGNoKGVycil7Y29uc29sZS5lcnJvcihgRXJyb3Igd2hlbiBydW5uaW5nIHRoZSBSb3V0ZXIgZXZlbnQ6ICR7ZXZlbnRGaWVsZH1gKTtjb25zb2xlLmVycm9yKGAke2Vyci5tZXNzYWdlfVxcbiR7ZXJyLnN0YWNrfWApO319fSk7fSk7fSk7ZnVuY3Rpb24gZ2V0Um91dGVyKCl7aWYoIXNpbmdsZXRvblJvdXRlci5yb3V0ZXIpe2NvbnN0IG1lc3NhZ2U9J05vIHJvdXRlciBpbnN0YW5jZSBmb3VuZC5cXG4nKydZb3Ugc2hvdWxkIG9ubHkgdXNlIFwibmV4dC9yb3V0ZXJcIiBvbiB0aGUgY2xpZW50IHNpZGUgb2YgeW91ciBhcHAuXFxuJzt0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7fXJldHVybiBzaW5nbGV0b25Sb3V0ZXIucm91dGVyO30vLyBFeHBvcnQgdGhlIHNpbmdsZXRvblJvdXRlciBhbmQgdGhpcyBpcyB0aGUgcHVibGljIEFQSS5cbnZhciBfZGVmYXVsdD1zaW5nbGV0b25Sb3V0ZXI7Ly8gUmVleHBvcnQgdGhlIHdpdGhSb3V0ZSBIT0NcbmV4cG9ydHMuZGVmYXVsdD1fZGVmYXVsdDtmdW5jdGlvbiB1c2VSb3V0ZXIoKXtyZXR1cm4gX3JlYWN0LmRlZmF1bHQudXNlQ29udGV4dChfcm91dGVyQ29udGV4dC5Sb3V0ZXJDb250ZXh0KTt9Ly8gSU5URVJOQUwgQVBJU1xuLy8gLS0tLS0tLS0tLS0tLVxuLy8gKGRvIG5vdCB1c2UgZm9sbG93aW5nIGV4cG9ydHMgaW5zaWRlIHRoZSBhcHApXG4vLyBDcmVhdGUgYSByb3V0ZXIgYW5kIGFzc2lnbiBpdCBhcyB0aGUgc2luZ2xldG9uIGluc3RhbmNlLlxuLy8gVGhpcyBpcyB1c2VkIGluIGNsaWVudCBzaWRlIHdoZW4gd2UgYXJlIGluaXRpbGl6aW5nIHRoZSBhcHAuXG4vLyBUaGlzIHNob3VsZCAqKm5vdCoqIGJlIHVzZWQgaW5zaWRlIHRoZSBzZXJ2ZXIuXG5jb25zdCBjcmVhdGVSb3V0ZXI9KC4uLmFyZ3MpPT57c2luZ2xldG9uUm91dGVyLnJvdXRlcj1uZXcgX3JvdXRlcjIuZGVmYXVsdCguLi5hcmdzKTtzaW5nbGV0b25Sb3V0ZXIucmVhZHlDYWxsYmFja3MuZm9yRWFjaChjYj0+Y2IoKSk7c2luZ2xldG9uUm91dGVyLnJlYWR5Q2FsbGJhY2tzPVtdO3JldHVybiBzaW5nbGV0b25Sb3V0ZXIucm91dGVyO307Ly8gVGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIGNyZWF0ZSB0aGUgYHdpdGhSb3V0ZXJgIHJvdXRlciBpbnN0YW5jZVxuZXhwb3J0cy5jcmVhdGVSb3V0ZXI9Y3JlYXRlUm91dGVyO2Z1bmN0aW9uIG1ha2VQdWJsaWNSb3V0ZXJJbnN0YW5jZShyb3V0ZXIpe2NvbnN0IF9yb3V0ZXI9cm91dGVyO2NvbnN0IGluc3RhbmNlPXt9O2Zvcihjb25zdCBwcm9wZXJ0eSBvZiB1cmxQcm9wZXJ0eUZpZWxkcyl7aWYodHlwZW9mIF9yb3V0ZXJbcHJvcGVydHldPT09J29iamVjdCcpe2luc3RhbmNlW3Byb3BlcnR5XT1PYmplY3QuYXNzaWduKEFycmF5LmlzQXJyYXkoX3JvdXRlcltwcm9wZXJ0eV0pP1tdOnt9LF9yb3V0ZXJbcHJvcGVydHldKTsvLyBtYWtlcyBzdXJlIHF1ZXJ5IGlzIG5vdCBzdGF0ZWZ1bFxuY29udGludWU7fWluc3RhbmNlW3Byb3BlcnR5XT1fcm91dGVyW3Byb3BlcnR5XTt9Ly8gRXZlbnRzIGlzIGEgc3RhdGljIHByb3BlcnR5IG9uIHRoZSByb3V0ZXIsIHRoZSByb3V0ZXIgZG9lc24ndCBoYXZlIHRvIGJlIGluaXRpYWxpemVkIHRvIHVzZSBpdFxuaW5zdGFuY2UuZXZlbnRzPV9yb3V0ZXIyLmRlZmF1bHQuZXZlbnRzO2NvcmVNZXRob2RGaWVsZHMuZm9yRWFjaChmaWVsZD0+e2luc3RhbmNlW2ZpZWxkXT0oLi4uYXJncyk9PntyZXR1cm4gX3JvdXRlcltmaWVsZF0oLi4uYXJncyk7fTt9KTtyZXR1cm4gaW5zdGFuY2U7fVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cm91dGVyLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO2V4cG9ydHMuX19lc01vZHVsZT10cnVlO2V4cG9ydHMudXNlSW50ZXJzZWN0aW9uPXVzZUludGVyc2VjdGlvbjt2YXIgX3JlYWN0PXJlcXVpcmUoXCJyZWFjdFwiKTt2YXIgX3JlcXVlc3RJZGxlQ2FsbGJhY2s9cmVxdWlyZShcIi4vcmVxdWVzdC1pZGxlLWNhbGxiYWNrXCIpO2NvbnN0IGhhc0ludGVyc2VjdGlvbk9ic2VydmVyPXR5cGVvZiBJbnRlcnNlY3Rpb25PYnNlcnZlciE9PSd1bmRlZmluZWQnO2Z1bmN0aW9uIHVzZUludGVyc2VjdGlvbih7cm9vdE1hcmdpbixkaXNhYmxlZH0pe2NvbnN0IGlzRGlzYWJsZWQ9ZGlzYWJsZWR8fCFoYXNJbnRlcnNlY3Rpb25PYnNlcnZlcjtjb25zdCB1bm9ic2VydmU9KDAsX3JlYWN0LnVzZVJlZikoKTtjb25zdFt2aXNpYmxlLHNldFZpc2libGVdPSgwLF9yZWFjdC51c2VTdGF0ZSkoZmFsc2UpO2NvbnN0IHNldFJlZj0oMCxfcmVhY3QudXNlQ2FsbGJhY2spKGVsPT57aWYodW5vYnNlcnZlLmN1cnJlbnQpe3Vub2JzZXJ2ZS5jdXJyZW50KCk7dW5vYnNlcnZlLmN1cnJlbnQ9dW5kZWZpbmVkO31pZihpc0Rpc2FibGVkfHx2aXNpYmxlKXJldHVybjtpZihlbCYmZWwudGFnTmFtZSl7dW5vYnNlcnZlLmN1cnJlbnQ9b2JzZXJ2ZShlbCxpc1Zpc2libGU9PmlzVmlzaWJsZSYmc2V0VmlzaWJsZShpc1Zpc2libGUpLHtyb290TWFyZ2lufSk7fX0sW2lzRGlzYWJsZWQscm9vdE1hcmdpbix2aXNpYmxlXSk7KDAsX3JlYWN0LnVzZUVmZmVjdCkoKCk9PntpZighaGFzSW50ZXJzZWN0aW9uT2JzZXJ2ZXIpe2lmKCF2aXNpYmxlKXtjb25zdCBpZGxlQ2FsbGJhY2s9KDAsX3JlcXVlc3RJZGxlQ2FsbGJhY2sucmVxdWVzdElkbGVDYWxsYmFjaykoKCk9PnNldFZpc2libGUodHJ1ZSkpO3JldHVybigpPT4oMCxfcmVxdWVzdElkbGVDYWxsYmFjay5jYW5jZWxJZGxlQ2FsbGJhY2spKGlkbGVDYWxsYmFjayk7fX19LFt2aXNpYmxlXSk7cmV0dXJuW3NldFJlZix2aXNpYmxlXTt9ZnVuY3Rpb24gb2JzZXJ2ZShlbGVtZW50LGNhbGxiYWNrLG9wdGlvbnMpe2NvbnN0e2lkLG9ic2VydmVyLGVsZW1lbnRzfT1jcmVhdGVPYnNlcnZlcihvcHRpb25zKTtlbGVtZW50cy5zZXQoZWxlbWVudCxjYWxsYmFjayk7b2JzZXJ2ZXIub2JzZXJ2ZShlbGVtZW50KTtyZXR1cm4gZnVuY3Rpb24gdW5vYnNlcnZlKCl7ZWxlbWVudHMuZGVsZXRlKGVsZW1lbnQpO29ic2VydmVyLnVub2JzZXJ2ZShlbGVtZW50KTsvLyBEZXN0cm95IG9ic2VydmVyIHdoZW4gdGhlcmUncyBub3RoaW5nIGxlZnQgdG8gd2F0Y2g6XG5pZihlbGVtZW50cy5zaXplPT09MCl7b2JzZXJ2ZXIuZGlzY29ubmVjdCgpO29ic2VydmVycy5kZWxldGUoaWQpO319O31jb25zdCBvYnNlcnZlcnM9bmV3IE1hcCgpO2Z1bmN0aW9uIGNyZWF0ZU9ic2VydmVyKG9wdGlvbnMpe2NvbnN0IGlkPW9wdGlvbnMucm9vdE1hcmdpbnx8Jyc7bGV0IGluc3RhbmNlPW9ic2VydmVycy5nZXQoaWQpO2lmKGluc3RhbmNlKXtyZXR1cm4gaW5zdGFuY2U7fWNvbnN0IGVsZW1lbnRzPW5ldyBNYXAoKTtjb25zdCBvYnNlcnZlcj1uZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIoZW50cmllcz0+e2VudHJpZXMuZm9yRWFjaChlbnRyeT0+e2NvbnN0IGNhbGxiYWNrPWVsZW1lbnRzLmdldChlbnRyeS50YXJnZXQpO2NvbnN0IGlzVmlzaWJsZT1lbnRyeS5pc0ludGVyc2VjdGluZ3x8ZW50cnkuaW50ZXJzZWN0aW9uUmF0aW8+MDtpZihjYWxsYmFjayYmaXNWaXNpYmxlKXtjYWxsYmFjayhpc1Zpc2libGUpO319KTt9LG9wdGlvbnMpO29ic2VydmVycy5zZXQoaWQsaW5zdGFuY2U9e2lkLG9ic2VydmVyLGVsZW1lbnRzfSk7cmV0dXJuIGluc3RhbmNlO31cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXVzZS1pbnRlcnNlY3Rpb24uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7dmFyIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQ9cmVxdWlyZShcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvaW50ZXJvcFJlcXVpcmVEZWZhdWx0XCIpO2V4cG9ydHMuX19lc01vZHVsZT10cnVlO2V4cG9ydHMuZGVmYXVsdD13aXRoUm91dGVyO3ZhciBfcmVhY3Q9X2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwicmVhY3RcIikpO3ZhciBfcm91dGVyPXJlcXVpcmUoXCIuL3JvdXRlclwiKTtmdW5jdGlvbiB3aXRoUm91dGVyKENvbXBvc2VkQ29tcG9uZW50KXtmdW5jdGlvbiBXaXRoUm91dGVyV3JhcHBlcihwcm9wcyl7cmV0dXJuLyojX19QVVJFX18qL19yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoQ29tcG9zZWRDb21wb25lbnQsT2JqZWN0LmFzc2lnbih7cm91dGVyOigwLF9yb3V0ZXIudXNlUm91dGVyKSgpfSxwcm9wcykpO31XaXRoUm91dGVyV3JhcHBlci5nZXRJbml0aWFsUHJvcHM9Q29tcG9zZWRDb21wb25lbnQuZ2V0SW5pdGlhbFByb3BzLy8gVGhpcyBpcyBuZWVkZWQgdG8gYWxsb3cgY2hlY2tpbmcgZm9yIGN1c3RvbSBnZXRJbml0aWFsUHJvcHMgaW4gX2FwcFxuO1dpdGhSb3V0ZXJXcmFwcGVyLm9yaWdHZXRJbml0aWFsUHJvcHM9Q29tcG9zZWRDb21wb25lbnQub3JpZ0dldEluaXRpYWxQcm9wcztpZihwcm9jZXNzLmVudi5OT0RFX0VOViE9PSdwcm9kdWN0aW9uJyl7Y29uc3QgbmFtZT1Db21wb3NlZENvbXBvbmVudC5kaXNwbGF5TmFtZXx8Q29tcG9zZWRDb21wb25lbnQubmFtZXx8J1Vua25vd24nO1dpdGhSb3V0ZXJXcmFwcGVyLmRpc3BsYXlOYW1lPWB3aXRoUm91dGVyKCR7bmFtZX0pYDt9cmV0dXJuIFdpdGhSb3V0ZXJXcmFwcGVyO31cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXdpdGgtcm91dGVyLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO2V4cG9ydHMuX19lc01vZHVsZT10cnVlO2V4cG9ydHMubm9ybWFsaXplTG9jYWxlUGF0aD1ub3JtYWxpemVMb2NhbGVQYXRoO2Z1bmN0aW9uIG5vcm1hbGl6ZUxvY2FsZVBhdGgocGF0aG5hbWUsbG9jYWxlcyl7bGV0IGRldGVjdGVkTG9jYWxlOy8vIGZpcnN0IGl0ZW0gd2lsbCBiZSBlbXB0eSBzdHJpbmcgZnJvbSBzcGxpdHRpbmcgYXQgZmlyc3QgY2hhclxuY29uc3QgcGF0aG5hbWVQYXJ0cz1wYXRobmFtZS5zcGxpdCgnLycpOyhsb2NhbGVzfHxbXSkuc29tZShsb2NhbGU9PntpZihwYXRobmFtZVBhcnRzWzFdLnRvTG93ZXJDYXNlKCk9PT1sb2NhbGUudG9Mb3dlckNhc2UoKSl7ZGV0ZWN0ZWRMb2NhbGU9bG9jYWxlO3BhdGhuYW1lUGFydHMuc3BsaWNlKDEsMSk7cGF0aG5hbWU9cGF0aG5hbWVQYXJ0cy5qb2luKCcvJyl8fCcvJztyZXR1cm4gdHJ1ZTt9cmV0dXJuIGZhbHNlO30pO3JldHVybntwYXRobmFtZSxkZXRlY3RlZExvY2FsZX07fVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bm9ybWFsaXplLWxvY2FsZS1wYXRoLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO2V4cG9ydHMuX19lc01vZHVsZT10cnVlO2V4cG9ydHMuZGVmYXVsdD1taXR0Oy8qXG5NSVQgTGljZW5zZVxuXG5Db3B5cmlnaHQgKGMpIEphc29uIE1pbGxlciAoaHR0cHM6Ly9qYXNvbmZvcm1hdC5jb20vKVxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4qLyAvLyBUaGlzIGZpbGUgaXMgYmFzZWQgb24gaHR0cHM6Ly9naXRodWIuY29tL2RldmVsb3BpdC9taXR0L2Jsb2IvdjEuMS4zL3NyYy9pbmRleC5qc1xuLy8gSXQncyBiZWVuIGVkaXRlZCBmb3IgdGhlIG5lZWRzIG9mIHRoaXMgc2NyaXB0XG4vLyBTZWUgdGhlIExJQ0VOU0UgYXQgdGhlIHRvcCBvZiB0aGUgZmlsZVxuZnVuY3Rpb24gbWl0dCgpe2NvbnN0IGFsbD1PYmplY3QuY3JlYXRlKG51bGwpO3JldHVybntvbih0eXBlLGhhbmRsZXIpezsoYWxsW3R5cGVdfHwoYWxsW3R5cGVdPVtdKSkucHVzaChoYW5kbGVyKTt9LG9mZih0eXBlLGhhbmRsZXIpe2lmKGFsbFt0eXBlXSl7YWxsW3R5cGVdLnNwbGljZShhbGxbdHlwZV0uaW5kZXhPZihoYW5kbGVyKT4+PjAsMSk7fX0sZW1pdCh0eXBlLC4uLmV2dHMpey8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBhcnJheS1jYWxsYmFjay1yZXR1cm5cbjsoYWxsW3R5cGVdfHxbXSkuc2xpY2UoKS5tYXAoaGFuZGxlcj0+e2hhbmRsZXIoLi4uZXZ0cyk7fSk7fX07fVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWl0dC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtleHBvcnRzLl9fZXNNb2R1bGU9dHJ1ZTtleHBvcnRzLmdldERvbWFpbkxvY2FsZT1nZXREb21haW5Mb2NhbGU7ZXhwb3J0cy5hZGRMb2NhbGU9YWRkTG9jYWxlO2V4cG9ydHMuZGVsTG9jYWxlPWRlbExvY2FsZTtleHBvcnRzLmhhc0Jhc2VQYXRoPWhhc0Jhc2VQYXRoO2V4cG9ydHMuYWRkQmFzZVBhdGg9YWRkQmFzZVBhdGg7ZXhwb3J0cy5kZWxCYXNlUGF0aD1kZWxCYXNlUGF0aDtleHBvcnRzLmlzTG9jYWxVUkw9aXNMb2NhbFVSTDtleHBvcnRzLmludGVycG9sYXRlQXM9aW50ZXJwb2xhdGVBcztleHBvcnRzLnJlc29sdmVIcmVmPXJlc29sdmVIcmVmO2V4cG9ydHMuZGVmYXVsdD12b2lkIDA7dmFyIF9ub3JtYWxpemVUcmFpbGluZ1NsYXNoPXJlcXVpcmUoXCIuLi8uLi8uLi9jbGllbnQvbm9ybWFsaXplLXRyYWlsaW5nLXNsYXNoXCIpO3ZhciBfcm91dGVMb2FkZXI9cmVxdWlyZShcIi4uLy4uLy4uL2NsaWVudC9yb3V0ZS1sb2FkZXJcIik7dmFyIF9kZW5vcm1hbGl6ZVBhZ2VQYXRoPXJlcXVpcmUoXCIuLi8uLi9zZXJ2ZXIvZGVub3JtYWxpemUtcGFnZS1wYXRoXCIpO3ZhciBfbm9ybWFsaXplTG9jYWxlUGF0aD1yZXF1aXJlKFwiLi4vaTE4bi9ub3JtYWxpemUtbG9jYWxlLXBhdGhcIik7dmFyIF9taXR0PV9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uL21pdHRcIikpO3ZhciBfdXRpbHM9cmVxdWlyZShcIi4uL3V0aWxzXCIpO3ZhciBfaXNEeW5hbWljPXJlcXVpcmUoXCIuL3V0aWxzL2lzLWR5bmFtaWNcIik7dmFyIF9wYXJzZVJlbGF0aXZlVXJsPXJlcXVpcmUoXCIuL3V0aWxzL3BhcnNlLXJlbGF0aXZlLXVybFwiKTt2YXIgX3F1ZXJ5c3RyaW5nPXJlcXVpcmUoXCIuL3V0aWxzL3F1ZXJ5c3RyaW5nXCIpO3ZhciBfcmVzb2x2ZVJld3JpdGVzPV9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vdXRpbHMvcmVzb2x2ZS1yZXdyaXRlc1wiKSk7dmFyIF9yb3V0ZU1hdGNoZXI9cmVxdWlyZShcIi4vdXRpbHMvcm91dGUtbWF0Y2hlclwiKTt2YXIgX3JvdXRlUmVnZXg9cmVxdWlyZShcIi4vdXRpbHMvcm91dGUtcmVnZXhcIik7ZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmope3JldHVybiBvYmomJm9iai5fX2VzTW9kdWxlP29iajp7ZGVmYXVsdDpvYmp9O30vLyB0c2xpbnQ6ZGlzYWJsZTpuby1jb25zb2xlXG5sZXQgZGV0ZWN0RG9tYWluTG9jYWxlO2lmKHByb2Nlc3MuZW52Ll9fTkVYVF9JMThOX1NVUFBPUlQpe2RldGVjdERvbWFpbkxvY2FsZT1yZXF1aXJlKCcuLi9pMThuL2RldGVjdC1kb21haW4tbG9jYWxlJykuZGV0ZWN0RG9tYWluTG9jYWxlO31jb25zdCBiYXNlUGF0aD1wcm9jZXNzLmVudi5fX05FWFRfUk9VVEVSX0JBU0VQQVRIfHwnJztmdW5jdGlvbiBidWlsZENhbmNlbGxhdGlvbkVycm9yKCl7cmV0dXJuIE9iamVjdC5hc3NpZ24obmV3IEVycm9yKCdSb3V0ZSBDYW5jZWxsZWQnKSx7Y2FuY2VsbGVkOnRydWV9KTt9ZnVuY3Rpb24gYWRkUGF0aFByZWZpeChwYXRoLHByZWZpeCl7cmV0dXJuIHByZWZpeCYmcGF0aC5zdGFydHNXaXRoKCcvJyk/cGF0aD09PScvJz8oMCxfbm9ybWFsaXplVHJhaWxpbmdTbGFzaC5ub3JtYWxpemVQYXRoVHJhaWxpbmdTbGFzaCkocHJlZml4KTpgJHtwcmVmaXh9JHtwYXRoTm9RdWVyeUhhc2gocGF0aCk9PT0nLyc/cGF0aC5zdWJzdHJpbmcoMSk6cGF0aH1gOnBhdGg7fWZ1bmN0aW9uIGdldERvbWFpbkxvY2FsZShwYXRoLGxvY2FsZSxsb2NhbGVzLGRvbWFpbkxvY2FsZXMpe2lmKHByb2Nlc3MuZW52Ll9fTkVYVF9JMThOX1NVUFBPUlQpe2xvY2FsZT1sb2NhbGV8fCgwLF9ub3JtYWxpemVMb2NhbGVQYXRoLm5vcm1hbGl6ZUxvY2FsZVBhdGgpKHBhdGgsbG9jYWxlcykuZGV0ZWN0ZWRMb2NhbGU7Y29uc3QgZGV0ZWN0ZWREb21haW49ZGV0ZWN0RG9tYWluTG9jYWxlKGRvbWFpbkxvY2FsZXMsdW5kZWZpbmVkLGxvY2FsZSk7aWYoZGV0ZWN0ZWREb21haW4pe3JldHVybmBodHRwJHtkZXRlY3RlZERvbWFpbi5odHRwPycnOidzJ306Ly8ke2RldGVjdGVkRG9tYWluLmRvbWFpbn0ke2Jhc2VQYXRofHwnJ30ke2xvY2FsZT09PWRldGVjdGVkRG9tYWluLmRlZmF1bHRMb2NhbGU/Jyc6YC8ke2xvY2FsZX1gfSR7cGF0aH1gO31yZXR1cm4gZmFsc2U7fXJldHVybiBmYWxzZTt9ZnVuY3Rpb24gYWRkTG9jYWxlKHBhdGgsbG9jYWxlLGRlZmF1bHRMb2NhbGUpe2lmKHByb2Nlc3MuZW52Ll9fTkVYVF9JMThOX1NVUFBPUlQpe2NvbnN0IHBhdGhuYW1lPXBhdGhOb1F1ZXJ5SGFzaChwYXRoKTtjb25zdCBwYXRoTG93ZXI9cGF0aG5hbWUudG9Mb3dlckNhc2UoKTtjb25zdCBsb2NhbGVMb3dlcj1sb2NhbGUmJmxvY2FsZS50b0xvd2VyQ2FzZSgpO3JldHVybiBsb2NhbGUmJmxvY2FsZSE9PWRlZmF1bHRMb2NhbGUmJiFwYXRoTG93ZXIuc3RhcnRzV2l0aCgnLycrbG9jYWxlTG93ZXIrJy8nKSYmcGF0aExvd2VyIT09Jy8nK2xvY2FsZUxvd2VyP2FkZFBhdGhQcmVmaXgocGF0aCwnLycrbG9jYWxlKTpwYXRoO31yZXR1cm4gcGF0aDt9ZnVuY3Rpb24gZGVsTG9jYWxlKHBhdGgsbG9jYWxlKXtpZihwcm9jZXNzLmVudi5fX05FWFRfSTE4Tl9TVVBQT1JUKXtjb25zdCBwYXRobmFtZT1wYXRoTm9RdWVyeUhhc2gocGF0aCk7Y29uc3QgcGF0aExvd2VyPXBhdGhuYW1lLnRvTG93ZXJDYXNlKCk7Y29uc3QgbG9jYWxlTG93ZXI9bG9jYWxlJiZsb2NhbGUudG9Mb3dlckNhc2UoKTtyZXR1cm4gbG9jYWxlJiYocGF0aExvd2VyLnN0YXJ0c1dpdGgoJy8nK2xvY2FsZUxvd2VyKycvJyl8fHBhdGhMb3dlcj09PScvJytsb2NhbGVMb3dlcik/KHBhdGhuYW1lLmxlbmd0aD09PWxvY2FsZS5sZW5ndGgrMT8nLyc6JycpK3BhdGguc3Vic3RyKGxvY2FsZS5sZW5ndGgrMSk6cGF0aDt9cmV0dXJuIHBhdGg7fWZ1bmN0aW9uIHBhdGhOb1F1ZXJ5SGFzaChwYXRoKXtjb25zdCBxdWVyeUluZGV4PXBhdGguaW5kZXhPZignPycpO2NvbnN0IGhhc2hJbmRleD1wYXRoLmluZGV4T2YoJyMnKTtpZihxdWVyeUluZGV4Pi0xfHxoYXNoSW5kZXg+LTEpe3BhdGg9cGF0aC5zdWJzdHJpbmcoMCxxdWVyeUluZGV4Pi0xP3F1ZXJ5SW5kZXg6aGFzaEluZGV4KTt9cmV0dXJuIHBhdGg7fWZ1bmN0aW9uIGhhc0Jhc2VQYXRoKHBhdGgpe3BhdGg9cGF0aE5vUXVlcnlIYXNoKHBhdGgpO3JldHVybiBwYXRoPT09YmFzZVBhdGh8fHBhdGguc3RhcnRzV2l0aChiYXNlUGF0aCsnLycpO31mdW5jdGlvbiBhZGRCYXNlUGF0aChwYXRoKXsvLyB3ZSBvbmx5IGFkZCB0aGUgYmFzZXBhdGggb24gcmVsYXRpdmUgdXJsc1xucmV0dXJuIGFkZFBhdGhQcmVmaXgocGF0aCxiYXNlUGF0aCk7fWZ1bmN0aW9uIGRlbEJhc2VQYXRoKHBhdGgpe3BhdGg9cGF0aC5zbGljZShiYXNlUGF0aC5sZW5ndGgpO2lmKCFwYXRoLnN0YXJ0c1dpdGgoJy8nKSlwYXRoPWAvJHtwYXRofWA7cmV0dXJuIHBhdGg7fS8qKlxuICogRGV0ZWN0cyB3aGV0aGVyIGEgZ2l2ZW4gdXJsIGlzIHJvdXRhYmxlIGJ5IHRoZSBOZXh0LmpzIHJvdXRlciAoYnJvd3NlciBvbmx5KS5cbiAqL2Z1bmN0aW9uIGlzTG9jYWxVUkwodXJsKXsvLyBwcmV2ZW50IGEgaHlkcmF0aW9uIG1pc21hdGNoIG9uIGhyZWYgZm9yIHVybCB3aXRoIGFuY2hvciByZWZzXG5pZih1cmwuc3RhcnRzV2l0aCgnLycpfHx1cmwuc3RhcnRzV2l0aCgnIycpfHx1cmwuc3RhcnRzV2l0aCgnPycpKXJldHVybiB0cnVlO3RyeXsvLyBhYnNvbHV0ZSB1cmxzIGNhbiBiZSBsb2NhbCBpZiB0aGV5IGFyZSBvbiB0aGUgc2FtZSBvcmlnaW5cbmNvbnN0IGxvY2F0aW9uT3JpZ2luPSgwLF91dGlscy5nZXRMb2NhdGlvbk9yaWdpbikoKTtjb25zdCByZXNvbHZlZD1uZXcgVVJMKHVybCxsb2NhdGlvbk9yaWdpbik7cmV0dXJuIHJlc29sdmVkLm9yaWdpbj09PWxvY2F0aW9uT3JpZ2luJiZoYXNCYXNlUGF0aChyZXNvbHZlZC5wYXRobmFtZSk7fWNhdGNoKF8pe3JldHVybiBmYWxzZTt9fWZ1bmN0aW9uIGludGVycG9sYXRlQXMocm91dGUsYXNQYXRobmFtZSxxdWVyeSl7bGV0IGludGVycG9sYXRlZFJvdXRlPScnO2NvbnN0IGR5bmFtaWNSZWdleD0oMCxfcm91dGVSZWdleC5nZXRSb3V0ZVJlZ2V4KShyb3V0ZSk7Y29uc3QgZHluYW1pY0dyb3Vwcz1keW5hbWljUmVnZXguZ3JvdXBzO2NvbnN0IGR5bmFtaWNNYXRjaGVzPS8vIFRyeSB0byBtYXRjaCB0aGUgZHluYW1pYyByb3V0ZSBhZ2FpbnN0IHRoZSBhc1BhdGhcbihhc1BhdGhuYW1lIT09cm91dGU/KDAsX3JvdXRlTWF0Y2hlci5nZXRSb3V0ZU1hdGNoZXIpKGR5bmFtaWNSZWdleCkoYXNQYXRobmFtZSk6JycpfHwvLyBGYWxsIGJhY2sgdG8gcmVhZGluZyB0aGUgdmFsdWVzIGZyb20gdGhlIGhyZWZcbi8vIFRPRE86IHNob3VsZCB0aGlzIHRha2UgcHJpb3JpdHk7IGFsc28gbmVlZCB0byBjaGFuZ2UgaW4gdGhlIHJvdXRlci5cbnF1ZXJ5O2ludGVycG9sYXRlZFJvdXRlPXJvdXRlO2NvbnN0IHBhcmFtcz1PYmplY3Qua2V5cyhkeW5hbWljR3JvdXBzKTtpZighcGFyYW1zLmV2ZXJ5KHBhcmFtPT57bGV0IHZhbHVlPWR5bmFtaWNNYXRjaGVzW3BhcmFtXXx8Jyc7Y29uc3R7cmVwZWF0LG9wdGlvbmFsfT1keW5hbWljR3JvdXBzW3BhcmFtXTsvLyBzdXBwb3J0IHNpbmdsZS1sZXZlbCBjYXRjaC1hbGxcbi8vIFRPRE86IG1vcmUgcm9idXN0IGhhbmRsaW5nIGZvciB1c2VyLWVycm9yIChwYXNzaW5nIGAvYClcbmxldCByZXBsYWNlZD1gWyR7cmVwZWF0PycuLi4nOicnfSR7cGFyYW19XWA7aWYob3B0aW9uYWwpe3JlcGxhY2VkPWAkeyF2YWx1ZT8nLyc6Jyd9WyR7cmVwbGFjZWR9XWA7fWlmKHJlcGVhdCYmIUFycmF5LmlzQXJyYXkodmFsdWUpKXZhbHVlPVt2YWx1ZV07cmV0dXJuKG9wdGlvbmFsfHxwYXJhbSBpbiBkeW5hbWljTWF0Y2hlcykmJigvLyBJbnRlcnBvbGF0ZSBncm91cCBpbnRvIGRhdGEgVVJMIGlmIHByZXNlbnRcbmludGVycG9sYXRlZFJvdXRlPWludGVycG9sYXRlZFJvdXRlLnJlcGxhY2UocmVwbGFjZWQscmVwZWF0P3ZhbHVlLm1hcCgvLyB0aGVzZSB2YWx1ZXMgc2hvdWxkIGJlIGZ1bGx5IGVuY29kZWQgaW5zdGVhZCBvZiBqdXN0XG4vLyBwYXRoIGRlbGltaXRlciBlc2NhcGVkIHNpbmNlIHRoZXkgYXJlIGJlaW5nIGluc2VydGVkXG4vLyBpbnRvIHRoZSBVUkwgYW5kIHdlIGV4cGVjdCBVUkwgZW5jb2RlZCBzZWdtZW50c1xuLy8gd2hlbiBwYXJzaW5nIGR5bmFtaWMgcm91dGUgcGFyYW1zXG5zZWdtZW50PT5lbmNvZGVVUklDb21wb25lbnQoc2VnbWVudCkpLmpvaW4oJy8nKTplbmNvZGVVUklDb21wb25lbnQodmFsdWUpKXx8Jy8nKTt9KSl7aW50ZXJwb2xhdGVkUm91dGU9Jyc7Ly8gZGlkIG5vdCBzYXRpc2Z5IGFsbCByZXF1aXJlbWVudHNcbi8vIG4uYi4gV2UgaWdub3JlIHRoaXMgZXJyb3IgYmVjYXVzZSB3ZSBoYW5kbGUgd2FybmluZyBmb3IgdGhpcyBjYXNlIGluXG4vLyBkZXZlbG9wbWVudCBpbiB0aGUgYDxMaW5rPmAgY29tcG9uZW50IGRpcmVjdGx5LlxufXJldHVybntwYXJhbXMscmVzdWx0OmludGVycG9sYXRlZFJvdXRlfTt9ZnVuY3Rpb24gb21pdFBhcm1zRnJvbVF1ZXJ5KHF1ZXJ5LHBhcmFtcyl7Y29uc3QgZmlsdGVyZWRRdWVyeT17fTtPYmplY3Qua2V5cyhxdWVyeSkuZm9yRWFjaChrZXk9PntpZighcGFyYW1zLmluY2x1ZGVzKGtleSkpe2ZpbHRlcmVkUXVlcnlba2V5XT1xdWVyeVtrZXldO319KTtyZXR1cm4gZmlsdGVyZWRRdWVyeTt9LyoqXG4gKiBSZXNvbHZlcyBhIGdpdmVuIGh5cGVybGluayB3aXRoIGEgY2VydGFpbiByb3V0ZXIgc3RhdGUgKGJhc2VQYXRoIG5vdCBpbmNsdWRlZCkuXG4gKiBQcmVzZXJ2ZXMgYWJzb2x1dGUgdXJscy5cbiAqL2Z1bmN0aW9uIHJlc29sdmVIcmVmKHJvdXRlcixocmVmLHJlc29sdmVBcyl7Ly8gd2UgdXNlIGEgZHVtbXkgYmFzZSB1cmwgZm9yIHJlbGF0aXZlIHVybHNcbmxldCBiYXNlO2NvbnN0IHVybEFzU3RyaW5nPXR5cGVvZiBocmVmPT09J3N0cmluZyc/aHJlZjooMCxfdXRpbHMuZm9ybWF0V2l0aFZhbGlkYXRpb24pKGhyZWYpO3RyeXtiYXNlPW5ldyBVUkwodXJsQXNTdHJpbmcuc3RhcnRzV2l0aCgnIycpP3JvdXRlci5hc1BhdGg6cm91dGVyLnBhdGhuYW1lLCdodHRwOi8vbicpO31jYXRjaChfKXsvLyBmYWxsYmFjayB0byAvIGZvciBpbnZhbGlkIGFzUGF0aCB2YWx1ZXMgZS5nLiAvL1xuYmFzZT1uZXcgVVJMKCcvJywnaHR0cDovL24nKTt9Ly8gUmV0dXJuIGJlY2F1c2UgaXQgY2Fubm90IGJlIHJvdXRlZCBieSB0aGUgTmV4dC5qcyByb3V0ZXJcbmlmKCFpc0xvY2FsVVJMKHVybEFzU3RyaW5nKSl7cmV0dXJuIHJlc29sdmVBcz9bdXJsQXNTdHJpbmddOnVybEFzU3RyaW5nO310cnl7Y29uc3QgZmluYWxVcmw9bmV3IFVSTCh1cmxBc1N0cmluZyxiYXNlKTtmaW5hbFVybC5wYXRobmFtZT0oMCxfbm9ybWFsaXplVHJhaWxpbmdTbGFzaC5ub3JtYWxpemVQYXRoVHJhaWxpbmdTbGFzaCkoZmluYWxVcmwucGF0aG5hbWUpO2xldCBpbnRlcnBvbGF0ZWRBcz0nJztpZigoMCxfaXNEeW5hbWljLmlzRHluYW1pY1JvdXRlKShmaW5hbFVybC5wYXRobmFtZSkmJmZpbmFsVXJsLnNlYXJjaFBhcmFtcyYmcmVzb2x2ZUFzKXtjb25zdCBxdWVyeT0oMCxfcXVlcnlzdHJpbmcuc2VhcmNoUGFyYW1zVG9VcmxRdWVyeSkoZmluYWxVcmwuc2VhcmNoUGFyYW1zKTtjb25zdHtyZXN1bHQscGFyYW1zfT1pbnRlcnBvbGF0ZUFzKGZpbmFsVXJsLnBhdGhuYW1lLGZpbmFsVXJsLnBhdGhuYW1lLHF1ZXJ5KTtpZihyZXN1bHQpe2ludGVycG9sYXRlZEFzPSgwLF91dGlscy5mb3JtYXRXaXRoVmFsaWRhdGlvbikoe3BhdGhuYW1lOnJlc3VsdCxoYXNoOmZpbmFsVXJsLmhhc2gscXVlcnk6b21pdFBhcm1zRnJvbVF1ZXJ5KHF1ZXJ5LHBhcmFtcyl9KTt9fS8vIGlmIHRoZSBvcmlnaW4gZGlkbid0IGNoYW5nZSwgaXQgbWVhbnMgd2UgcmVjZWl2ZWQgYSByZWxhdGl2ZSBocmVmXG5jb25zdCByZXNvbHZlZEhyZWY9ZmluYWxVcmwub3JpZ2luPT09YmFzZS5vcmlnaW4/ZmluYWxVcmwuaHJlZi5zbGljZShmaW5hbFVybC5vcmlnaW4ubGVuZ3RoKTpmaW5hbFVybC5ocmVmO3JldHVybiByZXNvbHZlQXM/W3Jlc29sdmVkSHJlZixpbnRlcnBvbGF0ZWRBc3x8cmVzb2x2ZWRIcmVmXTpyZXNvbHZlZEhyZWY7fWNhdGNoKF8pe3JldHVybiByZXNvbHZlQXM/W3VybEFzU3RyaW5nXTp1cmxBc1N0cmluZzt9fWZ1bmN0aW9uIHN0cmlwT3JpZ2luKHVybCl7Y29uc3Qgb3JpZ2luPSgwLF91dGlscy5nZXRMb2NhdGlvbk9yaWdpbikoKTtyZXR1cm4gdXJsLnN0YXJ0c1dpdGgob3JpZ2luKT91cmwuc3Vic3RyaW5nKG9yaWdpbi5sZW5ndGgpOnVybDt9ZnVuY3Rpb24gcHJlcGFyZVVybEFzKHJvdXRlcix1cmwsYXMpey8vIElmIHVybCBhbmQgYXMgcHJvdmlkZWQgYXMgYW4gb2JqZWN0IHJlcHJlc2VudGF0aW9uLFxuLy8gd2UnbGwgZm9ybWF0IHRoZW0gaW50byB0aGUgc3RyaW5nIHZlcnNpb24gaGVyZS5cbmxldFtyZXNvbHZlZEhyZWYscmVzb2x2ZWRBc109cmVzb2x2ZUhyZWYocm91dGVyLHVybCx0cnVlKTtjb25zdCBvcmlnaW49KDAsX3V0aWxzLmdldExvY2F0aW9uT3JpZ2luKSgpO2NvbnN0IGhyZWZIYWRPcmlnaW49cmVzb2x2ZWRIcmVmLnN0YXJ0c1dpdGgob3JpZ2luKTtjb25zdCBhc0hhZE9yaWdpbj1yZXNvbHZlZEFzJiZyZXNvbHZlZEFzLnN0YXJ0c1dpdGgob3JpZ2luKTtyZXNvbHZlZEhyZWY9c3RyaXBPcmlnaW4ocmVzb2x2ZWRIcmVmKTtyZXNvbHZlZEFzPXJlc29sdmVkQXM/c3RyaXBPcmlnaW4ocmVzb2x2ZWRBcyk6cmVzb2x2ZWRBcztjb25zdCBwcmVwYXJlZFVybD1ocmVmSGFkT3JpZ2luP3Jlc29sdmVkSHJlZjphZGRCYXNlUGF0aChyZXNvbHZlZEhyZWYpO2NvbnN0IHByZXBhcmVkQXM9YXM/c3RyaXBPcmlnaW4ocmVzb2x2ZUhyZWYocm91dGVyLGFzKSk6cmVzb2x2ZWRBc3x8cmVzb2x2ZWRIcmVmO3JldHVybnt1cmw6cHJlcGFyZWRVcmwsYXM6YXNIYWRPcmlnaW4/cHJlcGFyZWRBczphZGRCYXNlUGF0aChwcmVwYXJlZEFzKX07fWZ1bmN0aW9uIHJlc29sdmVEeW5hbWljUm91dGUocGF0aG5hbWUscGFnZXMpe2NvbnN0IGNsZWFuUGF0aG5hbWU9KDAsX25vcm1hbGl6ZVRyYWlsaW5nU2xhc2gucmVtb3ZlUGF0aFRyYWlsaW5nU2xhc2gpKCgwLF9kZW5vcm1hbGl6ZVBhZ2VQYXRoLmRlbm9ybWFsaXplUGFnZVBhdGgpKHBhdGhuYW1lKSk7aWYoY2xlYW5QYXRobmFtZT09PScvNDA0J3x8Y2xlYW5QYXRobmFtZT09PScvX2Vycm9yJyl7cmV0dXJuIHBhdGhuYW1lO30vLyBoYW5kbGUgcmVzb2x2aW5nIGhyZWYgZm9yIGR5bmFtaWMgcm91dGVzXG5pZighcGFnZXMuaW5jbHVkZXMoY2xlYW5QYXRobmFtZSkpey8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBhcnJheS1jYWxsYmFjay1yZXR1cm5cbnBhZ2VzLnNvbWUocGFnZT0+e2lmKCgwLF9pc0R5bmFtaWMuaXNEeW5hbWljUm91dGUpKHBhZ2UpJiYoMCxfcm91dGVSZWdleC5nZXRSb3V0ZVJlZ2V4KShwYWdlKS5yZS50ZXN0KGNsZWFuUGF0aG5hbWUpKXtwYXRobmFtZT1wYWdlO3JldHVybiB0cnVlO319KTt9cmV0dXJuKDAsX25vcm1hbGl6ZVRyYWlsaW5nU2xhc2gucmVtb3ZlUGF0aFRyYWlsaW5nU2xhc2gpKHBhdGhuYW1lKTt9Y29uc3QgbWFudWFsU2Nyb2xsUmVzdG9yYXRpb249cHJvY2Vzcy5lbnYuX19ORVhUX1NDUk9MTF9SRVNUT1JBVElPTiYmdHlwZW9mIHdpbmRvdyE9PSd1bmRlZmluZWQnJiYnc2Nyb2xsUmVzdG9yYXRpb24naW4gd2luZG93Lmhpc3RvcnkmJiEhZnVuY3Rpb24oKXt0cnl7bGV0IHY9J19fbmV4dCc7Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlcXVlbmNlc1xucmV0dXJuIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0odix2KSxzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKHYpLHRydWU7fWNhdGNoKG4pe319KCk7Y29uc3QgU1NHX0RBVEFfTk9UX0ZPVU5EPVN5bWJvbCgnU1NHX0RBVEFfTk9UX0ZPVU5EJyk7ZnVuY3Rpb24gZmV0Y2hSZXRyeSh1cmwsYXR0ZW1wdHMpe3JldHVybiBmZXRjaCh1cmwsey8vIENvb2tpZXMgYXJlIHJlcXVpcmVkIHRvIGJlIHByZXNlbnQgZm9yIE5leHQuanMnIFNTRyBcIlByZXZpZXcgTW9kZVwiLlxuLy8gQ29va2llcyBtYXkgYWxzbyBiZSByZXF1aXJlZCBmb3IgYGdldFNlcnZlclNpZGVQcm9wc2AuXG4vL1xuLy8gPiBgZmV0Y2hgIHdvbuKAmXQgc2VuZCBjb29raWVzLCB1bmxlc3MgeW91IHNldCB0aGUgY3JlZGVudGlhbHMgaW5pdFxuLy8gPiBvcHRpb24uXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRmV0Y2hfQVBJL1VzaW5nX0ZldGNoXG4vL1xuLy8gPiBGb3IgbWF4aW11bSBicm93c2VyIGNvbXBhdGliaWxpdHkgd2hlbiBpdCBjb21lcyB0byBzZW5kaW5nICZcbi8vID4gcmVjZWl2aW5nIGNvb2tpZXMsIGFsd2F5cyBzdXBwbHkgdGhlIGBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ2Bcbi8vID4gb3B0aW9uIGluc3RlYWQgb2YgcmVseWluZyBvbiB0aGUgZGVmYXVsdC5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9naXRodWIvZmV0Y2gjY2F2ZWF0c1xuY3JlZGVudGlhbHM6J3NhbWUtb3JpZ2luJ30pLnRoZW4ocmVzPT57aWYoIXJlcy5vayl7aWYoYXR0ZW1wdHM+MSYmcmVzLnN0YXR1cz49NTAwKXtyZXR1cm4gZmV0Y2hSZXRyeSh1cmwsYXR0ZW1wdHMtMSk7fWlmKHJlcy5zdGF0dXM9PT00MDQpe3JldHVybiByZXMuanNvbigpLnRoZW4oZGF0YT0+e2lmKGRhdGEubm90Rm91bmQpe3JldHVybntub3RGb3VuZDpTU0dfREFUQV9OT1RfRk9VTkR9O310aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBsb2FkIHN0YXRpYyBwcm9wc2ApO30pO310aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBsb2FkIHN0YXRpYyBwcm9wc2ApO31yZXR1cm4gcmVzLmpzb24oKTt9KTt9ZnVuY3Rpb24gZmV0Y2hOZXh0RGF0YShkYXRhSHJlZixpc1NlcnZlclJlbmRlcil7cmV0dXJuIGZldGNoUmV0cnkoZGF0YUhyZWYsaXNTZXJ2ZXJSZW5kZXI/MzoxKS5jYXRjaChlcnI9PnsvLyBXZSBzaG91bGQgb25seSB0cmlnZ2VyIGEgc2VydmVyLXNpZGUgdHJhbnNpdGlvbiBpZiB0aGlzIHdhcyBjYXVzZWRcbi8vIG9uIGEgY2xpZW50LXNpZGUgdHJhbnNpdGlvbi4gT3RoZXJ3aXNlLCB3ZSdkIGdldCBpbnRvIGFuIGluZmluaXRlXG4vLyBsb29wLlxuaWYoIWlzU2VydmVyUmVuZGVyKXsoMCxfcm91dGVMb2FkZXIubWFya0Fzc2V0RXJyb3IpKGVycik7fXRocm93IGVycjt9KTt9Y2xhc3MgUm91dGVyey8qKlxuICAgKiBNYXAgb2YgYWxsIGNvbXBvbmVudHMgbG9hZGVkIGluIGBSb3V0ZXJgXG4gICAqLyAvLyBTdGF0aWMgRGF0YSBDYWNoZVxuLy8gSW4tZmxpZ2h0IFNlcnZlciBEYXRhIFJlcXVlc3RzLCBmb3IgZGVkdXBpbmdcbmNvbnN0cnVjdG9yKF9wYXRobmFtZSxfcXVlcnksX2FzLHtpbml0aWFsUHJvcHMscGFnZUxvYWRlcixBcHAsd3JhcEFwcCxDb21wb25lbnQsZXJyLHN1YnNjcmlwdGlvbixpc0ZhbGxiYWNrLGxvY2FsZSxsb2NhbGVzLGRlZmF1bHRMb2NhbGUsZG9tYWluTG9jYWxlcyxpc1ByZXZpZXd9KXt0aGlzLnJvdXRlPXZvaWQgMDt0aGlzLnBhdGhuYW1lPXZvaWQgMDt0aGlzLnF1ZXJ5PXZvaWQgMDt0aGlzLmFzUGF0aD12b2lkIDA7dGhpcy5iYXNlUGF0aD12b2lkIDA7dGhpcy5jb21wb25lbnRzPXZvaWQgMDt0aGlzLnNkYz17fTt0aGlzLnNkcj17fTt0aGlzLnN1Yj12b2lkIDA7dGhpcy5jbGM9dm9pZCAwO3RoaXMucGFnZUxvYWRlcj12b2lkIDA7dGhpcy5fYnBzPXZvaWQgMDt0aGlzLmV2ZW50cz12b2lkIDA7dGhpcy5fd3JhcEFwcD12b2lkIDA7dGhpcy5pc1Nzcj12b2lkIDA7dGhpcy5pc0ZhbGxiYWNrPXZvaWQgMDt0aGlzLl9pbkZsaWdodFJvdXRlPXZvaWQgMDt0aGlzLl9zaGFsbG93PXZvaWQgMDt0aGlzLmxvY2FsZT12b2lkIDA7dGhpcy5sb2NhbGVzPXZvaWQgMDt0aGlzLmRlZmF1bHRMb2NhbGU9dm9pZCAwO3RoaXMuZG9tYWluTG9jYWxlcz12b2lkIDA7dGhpcy5pc1JlYWR5PXZvaWQgMDt0aGlzLmlzUHJldmlldz12b2lkIDA7dGhpcy5pc0xvY2FsZURvbWFpbj12b2lkIDA7dGhpcy5faWR4PTA7dGhpcy5vblBvcFN0YXRlPWU9Pntjb25zdCBzdGF0ZT1lLnN0YXRlO2lmKCFzdGF0ZSl7Ly8gV2UgZ2V0IHN0YXRlIGFzIHVuZGVmaW5lZCBmb3IgdHdvIHJlYXNvbnMuXG4vLyAgMS4gV2l0aCBvbGRlciBzYWZhcmkgKDwgOCkgYW5kIG9sZGVyIGNocm9tZSAoPCAzNClcbi8vICAyLiBXaGVuIHRoZSBVUkwgY2hhbmdlZCB3aXRoICNcbi8vXG4vLyBJbiB0aGUgYm90aCBjYXNlcywgd2UgZG9uJ3QgbmVlZCB0byBwcm9jZWVkIGFuZCBjaGFuZ2UgdGhlIHJvdXRlLlxuLy8gKGFzIGl0J3MgYWxyZWFkeSBjaGFuZ2VkKVxuLy8gQnV0IHdlIGNhbiBzaW1wbHkgcmVwbGFjZSB0aGUgc3RhdGUgd2l0aCB0aGUgbmV3IGNoYW5nZXMuXG4vLyBBY3R1YWxseSwgZm9yICgxKSB3ZSBkb24ndCBuZWVkIHRvIG5vdGhpbmcuIEJ1dCBpdCdzIGhhcmQgdG8gZGV0ZWN0IHRoYXQgZXZlbnQuXG4vLyBTbywgZG9pbmcgdGhlIGZvbGxvd2luZyBmb3IgKDEpIGRvZXMgbm8gaGFybS5cbmNvbnN0e3BhdGhuYW1lLHF1ZXJ5fT10aGlzO3RoaXMuY2hhbmdlU3RhdGUoJ3JlcGxhY2VTdGF0ZScsKDAsX3V0aWxzLmZvcm1hdFdpdGhWYWxpZGF0aW9uKSh7cGF0aG5hbWU6YWRkQmFzZVBhdGgocGF0aG5hbWUpLHF1ZXJ5fSksKDAsX3V0aWxzLmdldFVSTCkoKSk7cmV0dXJuO31pZighc3RhdGUuX19OKXtyZXR1cm47fWxldCBmb3JjZWRTY3JvbGw7Y29uc3R7dXJsLGFzLG9wdGlvbnMsaWR4fT1zdGF0ZTtpZihwcm9jZXNzLmVudi5fX05FWFRfU0NST0xMX1JFU1RPUkFUSU9OKXtpZihtYW51YWxTY3JvbGxSZXN0b3JhdGlvbil7aWYodGhpcy5faWR4IT09aWR4KXsvLyBTbmFwc2hvdCBjdXJyZW50IHNjcm9sbCBwb3NpdGlvbjpcbnRyeXtzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdfX25leHRfc2Nyb2xsXycrdGhpcy5faWR4LEpTT04uc3RyaW5naWZ5KHt4OnNlbGYucGFnZVhPZmZzZXQseTpzZWxmLnBhZ2VZT2Zmc2V0fSkpO31jYXRjaChfdW51c2VkKXt9Ly8gUmVzdG9yZSBvbGQgc2Nyb2xsIHBvc2l0aW9uOlxudHJ5e2NvbnN0IHY9c2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnX19uZXh0X3Njcm9sbF8nK2lkeCk7Zm9yY2VkU2Nyb2xsPUpTT04ucGFyc2Uodik7fWNhdGNoKF91bnVzZWQyKXtmb3JjZWRTY3JvbGw9e3g6MCx5OjB9O319fX10aGlzLl9pZHg9aWR4O2NvbnN0e3BhdGhuYW1lfT0oMCxfcGFyc2VSZWxhdGl2ZVVybC5wYXJzZVJlbGF0aXZlVXJsKSh1cmwpOy8vIE1ha2Ugc3VyZSB3ZSBkb24ndCByZS1yZW5kZXIgb24gaW5pdGlhbCBsb2FkLFxuLy8gY2FuIGJlIGNhdXNlZCBieSBuYXZpZ2F0aW5nIGJhY2sgZnJvbSBhbiBleHRlcm5hbCBzaXRlXG5pZih0aGlzLmlzU3NyJiZhcz09PXRoaXMuYXNQYXRoJiZwYXRobmFtZT09PXRoaXMucGF0aG5hbWUpe3JldHVybjt9Ly8gSWYgdGhlIGRvd25zdHJlYW0gYXBwbGljYXRpb24gcmV0dXJucyBmYWxzeSwgcmV0dXJuLlxuLy8gVGhleSB3aWxsIHRoZW4gYmUgcmVzcG9uc2libGUgZm9yIGhhbmRsaW5nIHRoZSBldmVudC5cbmlmKHRoaXMuX2JwcyYmIXRoaXMuX2JwcyhzdGF0ZSkpe3JldHVybjt9dGhpcy5jaGFuZ2UoJ3JlcGxhY2VTdGF0ZScsdXJsLGFzLE9iamVjdC5hc3NpZ24oe30sb3B0aW9ucyx7c2hhbGxvdzpvcHRpb25zLnNoYWxsb3cmJnRoaXMuX3NoYWxsb3csbG9jYWxlOm9wdGlvbnMubG9jYWxlfHx0aGlzLmRlZmF1bHRMb2NhbGV9KSxmb3JjZWRTY3JvbGwpO307Ly8gcmVwcmVzZW50cyB0aGUgY3VycmVudCBjb21wb25lbnQga2V5XG50aGlzLnJvdXRlPSgwLF9ub3JtYWxpemVUcmFpbGluZ1NsYXNoLnJlbW92ZVBhdGhUcmFpbGluZ1NsYXNoKShfcGF0aG5hbWUpOy8vIHNldCB1cCB0aGUgY29tcG9uZW50IGNhY2hlIChieSByb3V0ZSBrZXlzKVxudGhpcy5jb21wb25lbnRzPXt9Oy8vIFdlIHNob3VsZCBub3Qga2VlcCB0aGUgY2FjaGUsIGlmIHRoZXJlJ3MgYW4gZXJyb3Jcbi8vIE90aGVyd2lzZSwgdGhpcyBjYXVzZSBpc3N1ZXMgd2hlbiB3aGVuIGdvaW5nIGJhY2sgYW5kXG4vLyBjb21lIGFnYWluIHRvIHRoZSBlcnJvcmVkIHBhZ2UuXG5pZihfcGF0aG5hbWUhPT0nL19lcnJvcicpe3RoaXMuY29tcG9uZW50c1t0aGlzLnJvdXRlXT17Q29tcG9uZW50LGluaXRpYWw6dHJ1ZSxwcm9wczppbml0aWFsUHJvcHMsZXJyLF9fTl9TU0c6aW5pdGlhbFByb3BzJiZpbml0aWFsUHJvcHMuX19OX1NTRyxfX05fU1NQOmluaXRpYWxQcm9wcyYmaW5pdGlhbFByb3BzLl9fTl9TU1B9O310aGlzLmNvbXBvbmVudHNbJy9fYXBwJ109e0NvbXBvbmVudDpBcHAsc3R5bGVTaGVldHM6Wy8qIC9fYXBwIGRvZXMgbm90IG5lZWQgaXRzIHN0eWxlc2hlZXRzIG1hbmFnZWQgKi9dfTsvLyBCYWNrd2FyZHMgY29tcGF0IGZvciBSb3V0ZXIucm91dGVyLmV2ZW50c1xuLy8gVE9ETzogU2hvdWxkIGJlIHJlbW92ZSB0aGUgZm9sbG93aW5nIG1ham9yIHZlcnNpb24gYXMgaXQgd2FzIG5ldmVyIGRvY3VtZW50ZWRcbnRoaXMuZXZlbnRzPVJvdXRlci5ldmVudHM7dGhpcy5wYWdlTG9hZGVyPXBhZ2VMb2FkZXI7dGhpcy5wYXRobmFtZT1fcGF0aG5hbWU7dGhpcy5xdWVyeT1fcXVlcnk7Ly8gaWYgYXV0byBwcmVyZW5kZXJlZCBhbmQgZHluYW1pYyByb3V0ZSB3YWl0IHRvIHVwZGF0ZSBhc1BhdGhcbi8vIHVudGlsIGFmdGVyIG1vdW50IHRvIHByZXZlbnQgaHlkcmF0aW9uIG1pc21hdGNoXG5jb25zdCBhdXRvRXhwb3J0RHluYW1pYz0oMCxfaXNEeW5hbWljLmlzRHluYW1pY1JvdXRlKShfcGF0aG5hbWUpJiZzZWxmLl9fTkVYVF9EQVRBX18uYXV0b0V4cG9ydDt0aGlzLmFzUGF0aD1hdXRvRXhwb3J0RHluYW1pYz9fcGF0aG5hbWU6X2FzO3RoaXMuYmFzZVBhdGg9YmFzZVBhdGg7dGhpcy5zdWI9c3Vic2NyaXB0aW9uO3RoaXMuY2xjPW51bGw7dGhpcy5fd3JhcEFwcD13cmFwQXBwOy8vIG1ha2Ugc3VyZSB0byBpZ25vcmUgZXh0cmEgcG9wU3RhdGUgaW4gc2FmYXJpIG9uIG5hdmlnYXRpbmdcbi8vIGJhY2sgZnJvbSBleHRlcm5hbCBzaXRlXG50aGlzLmlzU3NyPXRydWU7dGhpcy5pc0ZhbGxiYWNrPWlzRmFsbGJhY2s7dGhpcy5pc1JlYWR5PSEhKHNlbGYuX19ORVhUX0RBVEFfXy5nc3NwfHxzZWxmLl9fTkVYVF9EQVRBX18uZ2lwfHwhYXV0b0V4cG9ydER5bmFtaWMmJiFzZWxmLmxvY2F0aW9uLnNlYXJjaCYmIXByb2Nlc3MuZW52Ll9fTkVYVF9IQVNfUkVXUklURVMpO3RoaXMuaXNQcmV2aWV3PSEhaXNQcmV2aWV3O3RoaXMuaXNMb2NhbGVEb21haW49ZmFsc2U7aWYocHJvY2Vzcy5lbnYuX19ORVhUX0kxOE5fU1VQUE9SVCl7dGhpcy5sb2NhbGU9bG9jYWxlO3RoaXMubG9jYWxlcz1sb2NhbGVzO3RoaXMuZGVmYXVsdExvY2FsZT1kZWZhdWx0TG9jYWxlO3RoaXMuZG9tYWluTG9jYWxlcz1kb21haW5Mb2NhbGVzO3RoaXMuaXNMb2NhbGVEb21haW49ISFkZXRlY3REb21haW5Mb2NhbGUoZG9tYWluTG9jYWxlcyxzZWxmLmxvY2F0aW9uLmhvc3RuYW1lKTt9aWYodHlwZW9mIHdpbmRvdyE9PSd1bmRlZmluZWQnKXsvLyBtYWtlIHN1cmUgXCJhc1wiIGRvZXNuJ3Qgc3RhcnQgd2l0aCBkb3VibGUgc2xhc2hlcyBvciBlbHNlIGl0IGNhblxuLy8gdGhyb3cgYW4gZXJyb3IgYXMgaXQncyBjb25zaWRlcmVkIGludmFsaWRcbmlmKF9hcy5zdWJzdHIoMCwyKSE9PScvLycpey8vIGluIG9yZGVyIGZvciBgZS5zdGF0ZWAgdG8gd29yayBvbiB0aGUgYG9ucG9wc3RhdGVgIGV2ZW50XG4vLyB3ZSBoYXZlIHRvIHJlZ2lzdGVyIHRoZSBpbml0aWFsIHJvdXRlIHVwb24gaW5pdGlhbGl6YXRpb25cbmNvbnN0IG9wdGlvbnM9e2xvY2FsZX07b3B0aW9ucy5fc2hvdWxkUmVzb2x2ZUhyZWY9X2FzIT09X3BhdGhuYW1lO3RoaXMuY2hhbmdlU3RhdGUoJ3JlcGxhY2VTdGF0ZScsKDAsX3V0aWxzLmZvcm1hdFdpdGhWYWxpZGF0aW9uKSh7cGF0aG5hbWU6YWRkQmFzZVBhdGgoX3BhdGhuYW1lKSxxdWVyeTpfcXVlcnl9KSwoMCxfdXRpbHMuZ2V0VVJMKSgpLG9wdGlvbnMpO313aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLHRoaXMub25Qb3BTdGF0ZSk7Ly8gZW5hYmxlIGN1c3RvbSBzY3JvbGwgcmVzdG9yYXRpb24gaGFuZGxpbmcgd2hlbiBhdmFpbGFibGVcbi8vIG90aGVyd2lzZSBmYWxsYmFjayB0byBicm93c2VyJ3MgZGVmYXVsdCBoYW5kbGluZ1xuaWYocHJvY2Vzcy5lbnYuX19ORVhUX1NDUk9MTF9SRVNUT1JBVElPTil7aWYobWFudWFsU2Nyb2xsUmVzdG9yYXRpb24pe3dpbmRvdy5oaXN0b3J5LnNjcm9sbFJlc3RvcmF0aW9uPSdtYW51YWwnO319fX1yZWxvYWQoKXt3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7fS8qKlxuICAgKiBHbyBiYWNrIGluIGhpc3RvcnlcbiAgICovYmFjaygpe3dpbmRvdy5oaXN0b3J5LmJhY2soKTt9LyoqXG4gICAqIFBlcmZvcm1zIGEgYHB1c2hTdGF0ZWAgd2l0aCBhcmd1bWVudHNcbiAgICogQHBhcmFtIHVybCBvZiB0aGUgcm91dGVcbiAgICogQHBhcmFtIGFzIG1hc2tzIGB1cmxgIGZvciB0aGUgYnJvd3NlclxuICAgKiBAcGFyYW0gb3B0aW9ucyBvYmplY3QgeW91IGNhbiBkZWZpbmUgYHNoYWxsb3dgIGFuZCBvdGhlciBvcHRpb25zXG4gICAqL3B1c2godXJsLGFzLG9wdGlvbnM9e30pe2lmKHByb2Nlc3MuZW52Ll9fTkVYVF9TQ1JPTExfUkVTVE9SQVRJT04pey8vIFRPRE86IHJlbW92ZSBpbiB0aGUgZnV0dXJlIHdoZW4gd2UgdXBkYXRlIGhpc3RvcnkgYmVmb3JlIHJvdXRlIGNoYW5nZVxuLy8gaXMgY29tcGxldGUsIGFzIHRoZSBwb3BzdGF0ZSBldmVudCBzaG91bGQgaGFuZGxlIHRoaXMgY2FwdHVyZS5cbmlmKG1hbnVhbFNjcm9sbFJlc3RvcmF0aW9uKXt0cnl7Ly8gU25hcHNob3Qgc2Nyb2xsIHBvc2l0aW9uIHJpZ2h0IGJlZm9yZSBuYXZpZ2F0aW5nIHRvIGEgbmV3IHBhZ2U6XG5zZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdfX25leHRfc2Nyb2xsXycrdGhpcy5faWR4LEpTT04uc3RyaW5naWZ5KHt4OnNlbGYucGFnZVhPZmZzZXQseTpzZWxmLnBhZ2VZT2Zmc2V0fSkpO31jYXRjaChfdW51c2VkMyl7fX19Oyh7dXJsLGFzfT1wcmVwYXJlVXJsQXModGhpcyx1cmwsYXMpKTtyZXR1cm4gdGhpcy5jaGFuZ2UoJ3B1c2hTdGF0ZScsdXJsLGFzLG9wdGlvbnMpO30vKipcbiAgICogUGVyZm9ybXMgYSBgcmVwbGFjZVN0YXRlYCB3aXRoIGFyZ3VtZW50c1xuICAgKiBAcGFyYW0gdXJsIG9mIHRoZSByb3V0ZVxuICAgKiBAcGFyYW0gYXMgbWFza3MgYHVybGAgZm9yIHRoZSBicm93c2VyXG4gICAqIEBwYXJhbSBvcHRpb25zIG9iamVjdCB5b3UgY2FuIGRlZmluZSBgc2hhbGxvd2AgYW5kIG90aGVyIG9wdGlvbnNcbiAgICovcmVwbGFjZSh1cmwsYXMsb3B0aW9ucz17fSl7Oyh7dXJsLGFzfT1wcmVwYXJlVXJsQXModGhpcyx1cmwsYXMpKTtyZXR1cm4gdGhpcy5jaGFuZ2UoJ3JlcGxhY2VTdGF0ZScsdXJsLGFzLG9wdGlvbnMpO31hc3luYyBjaGFuZ2UobWV0aG9kLHVybCxhcyxvcHRpb25zLGZvcmNlZFNjcm9sbCl7aWYoIWlzTG9jYWxVUkwodXJsKSl7d2luZG93LmxvY2F0aW9uLmhyZWY9dXJsO3JldHVybiBmYWxzZTt9Y29uc3Qgc2hvdWxkUmVzb2x2ZUhyZWY9dXJsPT09YXN8fG9wdGlvbnMuX2h8fG9wdGlvbnMuX3Nob3VsZFJlc29sdmVIcmVmOy8vIGZvciBzdGF0aWMgcGFnZXMgd2l0aCBxdWVyeSBwYXJhbXMgaW4gdGhlIFVSTCB3ZSBkZWxheVxuLy8gbWFya2luZyB0aGUgcm91dGVyIHJlYWR5IHVudGlsIGFmdGVyIHRoZSBxdWVyeSBpcyB1cGRhdGVkXG5pZihvcHRpb25zLl9oKXt0aGlzLmlzUmVhZHk9dHJ1ZTt9bGV0IGxvY2FsZUNoYW5nZT1vcHRpb25zLmxvY2FsZSE9PXRoaXMubG9jYWxlO2lmKHByb2Nlc3MuZW52Ll9fTkVYVF9JMThOX1NVUFBPUlQpe3RoaXMubG9jYWxlPW9wdGlvbnMubG9jYWxlPT09ZmFsc2U/dGhpcy5kZWZhdWx0TG9jYWxlOm9wdGlvbnMubG9jYWxlfHx0aGlzLmxvY2FsZTtpZih0eXBlb2Ygb3B0aW9ucy5sb2NhbGU9PT0ndW5kZWZpbmVkJyl7b3B0aW9ucy5sb2NhbGU9dGhpcy5sb2NhbGU7fWNvbnN0IHBhcnNlZEFzPSgwLF9wYXJzZVJlbGF0aXZlVXJsLnBhcnNlUmVsYXRpdmVVcmwpKGhhc0Jhc2VQYXRoKGFzKT9kZWxCYXNlUGF0aChhcyk6YXMpO2NvbnN0IGxvY2FsZVBhdGhSZXN1bHQ9KDAsX25vcm1hbGl6ZUxvY2FsZVBhdGgubm9ybWFsaXplTG9jYWxlUGF0aCkocGFyc2VkQXMucGF0aG5hbWUsdGhpcy5sb2NhbGVzKTtpZihsb2NhbGVQYXRoUmVzdWx0LmRldGVjdGVkTG9jYWxlKXt0aGlzLmxvY2FsZT1sb2NhbGVQYXRoUmVzdWx0LmRldGVjdGVkTG9jYWxlO3BhcnNlZEFzLnBhdGhuYW1lPWFkZEJhc2VQYXRoKHBhcnNlZEFzLnBhdGhuYW1lKTthcz0oMCxfdXRpbHMuZm9ybWF0V2l0aFZhbGlkYXRpb24pKHBhcnNlZEFzKTt1cmw9YWRkQmFzZVBhdGgoKDAsX25vcm1hbGl6ZUxvY2FsZVBhdGgubm9ybWFsaXplTG9jYWxlUGF0aCkoaGFzQmFzZVBhdGgodXJsKT9kZWxCYXNlUGF0aCh1cmwpOnVybCx0aGlzLmxvY2FsZXMpLnBhdGhuYW1lKTt9bGV0IGRpZE5hdmlnYXRlPWZhbHNlOy8vIHdlIG5lZWQgdG8gd3JhcCB0aGlzIGluIHRoZSBlbnYgY2hlY2sgYWdhaW4gc2luY2UgcmVnZW5lcmF0b3IgcnVudGltZVxuLy8gbW92ZXMgdGhpcyBvbiBpdHMgb3duIGR1ZSB0byB0aGUgcmV0dXJuXG5pZihwcm9jZXNzLmVudi5fX05FWFRfSTE4Tl9TVVBQT1JUKXt2YXIgX3RoaXMkbG9jYWxlczsvLyBpZiB0aGUgbG9jYWxlIGlzbid0IGNvbmZpZ3VyZWQgaGFyZCBuYXZpZ2F0ZSB0byBzaG93IDQwNCBwYWdlXG5pZighKChfdGhpcyRsb2NhbGVzPXRoaXMubG9jYWxlcykhPW51bGwmJl90aGlzJGxvY2FsZXMuaW5jbHVkZXModGhpcy5sb2NhbGUpKSl7cGFyc2VkQXMucGF0aG5hbWU9YWRkTG9jYWxlKHBhcnNlZEFzLnBhdGhuYW1lLHRoaXMubG9jYWxlKTt3aW5kb3cubG9jYXRpb24uaHJlZj0oMCxfdXRpbHMuZm9ybWF0V2l0aFZhbGlkYXRpb24pKHBhcnNlZEFzKTsvLyB0aGlzIHdhcyBwcmV2aW91c2x5IGEgcmV0dXJuIGJ1dCB3YXMgcmVtb3ZlZCBpbiBmYXZvclxuLy8gb2YgYmV0dGVyIGRlYWQgY29kZSBlbGltaW5hdGlvbiB3aXRoIHJlZ2VuZXJhdG9yIHJ1bnRpbWVcbmRpZE5hdmlnYXRlPXRydWU7fX1jb25zdCBkZXRlY3RlZERvbWFpbj1kZXRlY3REb21haW5Mb2NhbGUodGhpcy5kb21haW5Mb2NhbGVzLHVuZGVmaW5lZCx0aGlzLmxvY2FsZSk7Ly8gd2UgbmVlZCB0byB3cmFwIHRoaXMgaW4gdGhlIGVudiBjaGVjayBhZ2FpbiBzaW5jZSByZWdlbmVyYXRvciBydW50aW1lXG4vLyBtb3ZlcyB0aGlzIG9uIGl0cyBvd24gZHVlIHRvIHRoZSByZXR1cm5cbmlmKHByb2Nlc3MuZW52Ll9fTkVYVF9JMThOX1NVUFBPUlQpey8vIGlmIHdlIGFyZSBuYXZpZ2F0aW5nIHRvIGEgZG9tYWluIGxvY2FsZSBlbnN1cmUgd2UgcmVkaXJlY3QgdG8gdGhlXG4vLyBjb3JyZWN0IGRvbWFpblxuaWYoIWRpZE5hdmlnYXRlJiZkZXRlY3RlZERvbWFpbiYmdGhpcy5pc0xvY2FsZURvbWFpbiYmc2VsZi5sb2NhdGlvbi5ob3N0bmFtZSE9PWRldGVjdGVkRG9tYWluLmRvbWFpbil7Y29uc3QgYXNOb0Jhc2VQYXRoPWRlbEJhc2VQYXRoKGFzKTt3aW5kb3cubG9jYXRpb24uaHJlZj1gaHR0cCR7ZGV0ZWN0ZWREb21haW4uaHR0cD8nJzoncyd9Oi8vJHtkZXRlY3RlZERvbWFpbi5kb21haW59JHthZGRCYXNlUGF0aChgJHt0aGlzLmxvY2FsZT09PWRldGVjdGVkRG9tYWluLmRlZmF1bHRMb2NhbGU/Jyc6YC8ke3RoaXMubG9jYWxlfWB9JHthc05vQmFzZVBhdGg9PT0nLyc/Jyc6YXNOb0Jhc2VQYXRofWB8fCcvJyl9YDsvLyB0aGlzIHdhcyBwcmV2aW91c2x5IGEgcmV0dXJuIGJ1dCB3YXMgcmVtb3ZlZCBpbiBmYXZvclxuLy8gb2YgYmV0dGVyIGRlYWQgY29kZSBlbGltaW5hdGlvbiB3aXRoIHJlZ2VuZXJhdG9yIHJ1bnRpbWVcbmRpZE5hdmlnYXRlPXRydWU7fX1pZihkaWROYXZpZ2F0ZSl7cmV0dXJuIG5ldyBQcm9taXNlKCgpPT57fSk7fX1pZighb3B0aW9ucy5faCl7dGhpcy5pc1Nzcj1mYWxzZTt9Ly8gbWFya2luZyByb3V0ZSBjaGFuZ2VzIGFzIGEgbmF2aWdhdGlvbiBzdGFydCBlbnRyeVxuaWYoX3V0aWxzLlNUKXtwZXJmb3JtYW5jZS5tYXJrKCdyb3V0ZUNoYW5nZScpO31jb25zdHtzaGFsbG93PWZhbHNlfT1vcHRpb25zO2NvbnN0IHJvdXRlUHJvcHM9e3NoYWxsb3d9O2lmKHRoaXMuX2luRmxpZ2h0Um91dGUpe3RoaXMuYWJvcnRDb21wb25lbnRMb2FkKHRoaXMuX2luRmxpZ2h0Um91dGUscm91dGVQcm9wcyk7fWFzPWFkZEJhc2VQYXRoKGFkZExvY2FsZShoYXNCYXNlUGF0aChhcyk/ZGVsQmFzZVBhdGgoYXMpOmFzLG9wdGlvbnMubG9jYWxlLHRoaXMuZGVmYXVsdExvY2FsZSkpO2NvbnN0IGNsZWFuZWRBcz1kZWxMb2NhbGUoaGFzQmFzZVBhdGgoYXMpP2RlbEJhc2VQYXRoKGFzKTphcyx0aGlzLmxvY2FsZSk7dGhpcy5faW5GbGlnaHRSb3V0ZT1hczsvLyBJZiB0aGUgdXJsIGNoYW5nZSBpcyBvbmx5IHJlbGF0ZWQgdG8gYSBoYXNoIGNoYW5nZVxuLy8gV2Ugc2hvdWxkIG5vdCBwcm9jZWVkLiBXZSBzaG91bGQgb25seSBjaGFuZ2UgdGhlIHN0YXRlLlxuLy8gV0FSTklORzogYF9oYCBpcyBhbiBpbnRlcm5hbCBvcHRpb24gZm9yIGhhbmRpbmcgTmV4dC5qcyBjbGllbnQtc2lkZVxuLy8gaHlkcmF0aW9uLiBZb3VyIGFwcCBzaG91bGQgX25ldmVyXyB1c2UgdGhpcyBwcm9wZXJ0eS4gSXQgbWF5IGNoYW5nZSBhdFxuLy8gYW55IHRpbWUgd2l0aG91dCBub3RpY2UuXG5pZighb3B0aW9ucy5faCYmdGhpcy5vbmx5QUhhc2hDaGFuZ2UoY2xlYW5lZEFzKSl7dGhpcy5hc1BhdGg9Y2xlYW5lZEFzO1JvdXRlci5ldmVudHMuZW1pdCgnaGFzaENoYW5nZVN0YXJ0Jyxhcyxyb3V0ZVByb3BzKTsvLyBUT0RPOiBkbyB3ZSBuZWVkIHRoZSByZXNvbHZlZCBocmVmIHdoZW4gb25seSBhIGhhc2ggY2hhbmdlP1xudGhpcy5jaGFuZ2VTdGF0ZShtZXRob2QsdXJsLGFzLG9wdGlvbnMpO3RoaXMuc2Nyb2xsVG9IYXNoKGNsZWFuZWRBcyk7dGhpcy5ub3RpZnkodGhpcy5jb21wb25lbnRzW3RoaXMucm91dGVdLG51bGwpO1JvdXRlci5ldmVudHMuZW1pdCgnaGFzaENoYW5nZUNvbXBsZXRlJyxhcyxyb3V0ZVByb3BzKTtyZXR1cm4gdHJ1ZTt9bGV0IHBhcnNlZD0oMCxfcGFyc2VSZWxhdGl2ZVVybC5wYXJzZVJlbGF0aXZlVXJsKSh1cmwpO2xldHtwYXRobmFtZSxxdWVyeX09cGFyc2VkOy8vIFRoZSBidWlsZCBtYW5pZmVzdCBuZWVkcyB0byBiZSBsb2FkZWQgYmVmb3JlIGF1dG8tc3RhdGljIGR5bmFtaWMgcGFnZXNcbi8vIGdldCB0aGVpciBxdWVyeSBwYXJhbWV0ZXJzIHRvIGFsbG93IGVuc3VyaW5nIHRoZXkgY2FuIGJlIHBhcnNlZCBwcm9wZXJseVxuLy8gd2hlbiByZXdyaXR0ZW4gdG9cbmxldCBwYWdlcyxyZXdyaXRlczt0cnl7cGFnZXM9YXdhaXQgdGhpcy5wYWdlTG9hZGVyLmdldFBhZ2VMaXN0KCk7KHtfX3Jld3JpdGVzOnJld3JpdGVzfT1hd2FpdCgwLF9yb3V0ZUxvYWRlci5nZXRDbGllbnRCdWlsZE1hbmlmZXN0KSgpKTt9Y2F0Y2goZXJyKXsvLyBJZiB3ZSBmYWlsIHRvIHJlc29sdmUgdGhlIHBhZ2UgbGlzdCBvciBjbGllbnQtYnVpbGQgbWFuaWZlc3QsIHdlIG11c3Rcbi8vIGRvIGEgc2VydmVyLXNpZGUgdHJhbnNpdGlvbjpcbndpbmRvdy5sb2NhdGlvbi5ocmVmPWFzO3JldHVybiBmYWxzZTt9Ly8gSWYgYXNrZWQgdG8gY2hhbmdlIHRoZSBjdXJyZW50IFVSTCB3ZSBzaG91bGQgcmVsb2FkIHRoZSBjdXJyZW50IHBhZ2Vcbi8vIChub3QgbG9jYXRpb24ucmVsb2FkKCkgYnV0IHJlbG9hZCBnZXRJbml0aWFsUHJvcHMgYW5kIG90aGVyIE5leHQuanMgc3R1ZmZzKVxuLy8gV2UgYWxzbyBuZWVkIHRvIHNldCB0aGUgbWV0aG9kID0gcmVwbGFjZVN0YXRlIGFsd2F5c1xuLy8gYXMgdGhpcyBzaG91bGQgbm90IGdvIGludG8gdGhlIGhpc3RvcnkgKFRoYXQncyBob3cgYnJvd3NlcnMgd29yaylcbi8vIFdlIHNob3VsZCBjb21wYXJlIHRoZSBuZXcgYXNQYXRoIHRvIHRoZSBjdXJyZW50IGFzUGF0aCwgbm90IHRoZSB1cmxcbmlmKCF0aGlzLnVybElzTmV3KGNsZWFuZWRBcykmJiFsb2NhbGVDaGFuZ2Upe21ldGhvZD0ncmVwbGFjZVN0YXRlJzt9Ly8gd2UgbmVlZCB0byByZXNvbHZlIHRoZSBhcyB2YWx1ZSB1c2luZyByZXdyaXRlcyBmb3IgZHluYW1pYyBTU0dcbi8vIHBhZ2VzIHRvIGFsbG93IGJ1aWxkaW5nIHRoZSBkYXRhIFVSTCBjb3JyZWN0bHlcbmxldCByZXNvbHZlZEFzPWFzOy8vIHVybCBhbmQgYXMgc2hvdWxkIGFsd2F5cyBiZSBwcmVmaXhlZCB3aXRoIGJhc2VQYXRoIGJ5IHRoaXNcbi8vIHBvaW50IGJ5IGVpdGhlciBuZXh0L2xpbmsgb3Igcm91dGVyLnB1c2gvcmVwbGFjZSBzbyBzdHJpcCB0aGVcbi8vIGJhc2VQYXRoIGZyb20gdGhlIHBhdGhuYW1lIHRvIG1hdGNoIHRoZSBwYWdlcyBkaXIgMS10by0xXG5wYXRobmFtZT1wYXRobmFtZT8oMCxfbm9ybWFsaXplVHJhaWxpbmdTbGFzaC5yZW1vdmVQYXRoVHJhaWxpbmdTbGFzaCkoZGVsQmFzZVBhdGgocGF0aG5hbWUpKTpwYXRobmFtZTtpZihzaG91bGRSZXNvbHZlSHJlZiYmcGF0aG5hbWUhPT0nL19lcnJvcicpeztvcHRpb25zLl9zaG91bGRSZXNvbHZlSHJlZj10cnVlO2lmKHByb2Nlc3MuZW52Ll9fTkVYVF9IQVNfUkVXUklURVMmJmFzLnN0YXJ0c1dpdGgoJy8nKSl7Y29uc3QgcmV3cml0ZXNSZXN1bHQ9KDAsX3Jlc29sdmVSZXdyaXRlcy5kZWZhdWx0KShhZGRCYXNlUGF0aChhZGRMb2NhbGUoY2xlYW5lZEFzLHRoaXMubG9jYWxlKSkscGFnZXMscmV3cml0ZXMscXVlcnkscD0+cmVzb2x2ZUR5bmFtaWNSb3V0ZShwLHBhZ2VzKSx0aGlzLmxvY2FsZXMpO3Jlc29sdmVkQXM9cmV3cml0ZXNSZXN1bHQuYXNQYXRoO2lmKHJld3JpdGVzUmVzdWx0Lm1hdGNoZWRQYWdlJiZyZXdyaXRlc1Jlc3VsdC5yZXNvbHZlZEhyZWYpey8vIGlmIHRoaXMgZGlyZWN0bHkgbWF0Y2hlcyBhIHBhZ2Ugd2UgbmVlZCB0byB1cGRhdGUgdGhlIGhyZWYgdG9cbi8vIGFsbG93IHRoZSBjb3JyZWN0IHBhZ2UgY2h1bmsgdG8gYmUgbG9hZGVkXG5wYXRobmFtZT1yZXdyaXRlc1Jlc3VsdC5yZXNvbHZlZEhyZWY7cGFyc2VkLnBhdGhuYW1lPWFkZEJhc2VQYXRoKHBhdGhuYW1lKTt1cmw9KDAsX3V0aWxzLmZvcm1hdFdpdGhWYWxpZGF0aW9uKShwYXJzZWQpO319ZWxzZXtwYXJzZWQucGF0aG5hbWU9cmVzb2x2ZUR5bmFtaWNSb3V0ZShwYXRobmFtZSxwYWdlcyk7aWYocGFyc2VkLnBhdGhuYW1lIT09cGF0aG5hbWUpe3BhdGhuYW1lPXBhcnNlZC5wYXRobmFtZTtwYXJzZWQucGF0aG5hbWU9YWRkQmFzZVBhdGgocGF0aG5hbWUpO3VybD0oMCxfdXRpbHMuZm9ybWF0V2l0aFZhbGlkYXRpb24pKHBhcnNlZCk7fX19Y29uc3Qgcm91dGU9KDAsX25vcm1hbGl6ZVRyYWlsaW5nU2xhc2gucmVtb3ZlUGF0aFRyYWlsaW5nU2xhc2gpKHBhdGhuYW1lKTtpZighaXNMb2NhbFVSTChhcykpe2lmKHByb2Nlc3MuZW52Lk5PREVfRU5WIT09J3Byb2R1Y3Rpb24nKXt0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgaHJlZjogXCIke3VybH1cIiBhbmQgYXM6IFwiJHthc31cIiwgcmVjZWl2ZWQgcmVsYXRpdmUgaHJlZiBhbmQgZXh0ZXJuYWwgYXNgK2BcXG5TZWUgbW9yZSBpbmZvOiBodHRwczovL25leHRqcy5vcmcvZG9jcy9tZXNzYWdlcy9pbnZhbGlkLXJlbGF0aXZlLXVybC1leHRlcm5hbC1hc2ApO313aW5kb3cubG9jYXRpb24uaHJlZj1hcztyZXR1cm4gZmFsc2U7fXJlc29sdmVkQXM9ZGVsTG9jYWxlKGRlbEJhc2VQYXRoKHJlc29sdmVkQXMpLHRoaXMubG9jYWxlKTtpZigoMCxfaXNEeW5hbWljLmlzRHluYW1pY1JvdXRlKShyb3V0ZSkpe2NvbnN0IHBhcnNlZEFzPSgwLF9wYXJzZVJlbGF0aXZlVXJsLnBhcnNlUmVsYXRpdmVVcmwpKHJlc29sdmVkQXMpO2NvbnN0IGFzUGF0aG5hbWU9cGFyc2VkQXMucGF0aG5hbWU7Y29uc3Qgcm91dGVSZWdleD0oMCxfcm91dGVSZWdleC5nZXRSb3V0ZVJlZ2V4KShyb3V0ZSk7Y29uc3Qgcm91dGVNYXRjaD0oMCxfcm91dGVNYXRjaGVyLmdldFJvdXRlTWF0Y2hlcikocm91dGVSZWdleCkoYXNQYXRobmFtZSk7Y29uc3Qgc2hvdWxkSW50ZXJwb2xhdGU9cm91dGU9PT1hc1BhdGhuYW1lO2NvbnN0IGludGVycG9sYXRlZEFzPXNob3VsZEludGVycG9sYXRlP2ludGVycG9sYXRlQXMocm91dGUsYXNQYXRobmFtZSxxdWVyeSk6e307aWYoIXJvdXRlTWF0Y2h8fHNob3VsZEludGVycG9sYXRlJiYhaW50ZXJwb2xhdGVkQXMucmVzdWx0KXtjb25zdCBtaXNzaW5nUGFyYW1zPU9iamVjdC5rZXlzKHJvdXRlUmVnZXguZ3JvdXBzKS5maWx0ZXIocGFyYW09PiFxdWVyeVtwYXJhbV0pO2lmKG1pc3NpbmdQYXJhbXMubGVuZ3RoPjApe2lmKHByb2Nlc3MuZW52Lk5PREVfRU5WIT09J3Byb2R1Y3Rpb24nKXtjb25zb2xlLndhcm4oYCR7c2hvdWxkSW50ZXJwb2xhdGU/YEludGVycG9sYXRpbmcgaHJlZmA6YE1pc21hdGNoaW5nIFxcYGFzXFxgIGFuZCBcXGBocmVmXFxgYH0gZmFpbGVkIHRvIG1hbnVhbGx5IHByb3ZpZGUgYCtgdGhlIHBhcmFtczogJHttaXNzaW5nUGFyYW1zLmpvaW4oJywgJyl9IGluIHRoZSBcXGBocmVmXFxgJ3MgXFxgcXVlcnlcXGBgKTt9dGhyb3cgbmV3IEVycm9yKChzaG91bGRJbnRlcnBvbGF0ZT9gVGhlIHByb3ZpZGVkIFxcYGhyZWZcXGAgKCR7dXJsfSkgdmFsdWUgaXMgbWlzc2luZyBxdWVyeSB2YWx1ZXMgKCR7bWlzc2luZ1BhcmFtcy5qb2luKCcsICcpfSkgdG8gYmUgaW50ZXJwb2xhdGVkIHByb3Blcmx5LiBgOmBUaGUgcHJvdmlkZWQgXFxgYXNcXGAgdmFsdWUgKCR7YXNQYXRobmFtZX0pIGlzIGluY29tcGF0aWJsZSB3aXRoIHRoZSBcXGBocmVmXFxgIHZhbHVlICgke3JvdXRlfSkuIGApK2BSZWFkIG1vcmU6IGh0dHBzOi8vbmV4dGpzLm9yZy9kb2NzL21lc3NhZ2VzLyR7c2hvdWxkSW50ZXJwb2xhdGU/J2hyZWYtaW50ZXJwb2xhdGlvbi1mYWlsZWQnOidpbmNvbXBhdGlibGUtaHJlZi1hcyd9YCk7fX1lbHNlIGlmKHNob3VsZEludGVycG9sYXRlKXthcz0oMCxfdXRpbHMuZm9ybWF0V2l0aFZhbGlkYXRpb24pKE9iamVjdC5hc3NpZ24oe30scGFyc2VkQXMse3BhdGhuYW1lOmludGVycG9sYXRlZEFzLnJlc3VsdCxxdWVyeTpvbWl0UGFybXNGcm9tUXVlcnkocXVlcnksaW50ZXJwb2xhdGVkQXMucGFyYW1zKX0pKTt9ZWxzZXsvLyBNZXJnZSBwYXJhbXMgaW50byBgcXVlcnlgLCBvdmVyd3JpdGluZyBhbnkgc3BlY2lmaWVkIGluIHNlYXJjaFxuT2JqZWN0LmFzc2lnbihxdWVyeSxyb3V0ZU1hdGNoKTt9fVJvdXRlci5ldmVudHMuZW1pdCgncm91dGVDaGFuZ2VTdGFydCcsYXMscm91dGVQcm9wcyk7dHJ5e3ZhciBfc2VsZiRfX05FWFRfREFUQV9fJHAsX3NlbGYkX19ORVhUX0RBVEFfXyRwMixfb3B0aW9ucyRzY3JvbGw7bGV0IHJvdXRlSW5mbz1hd2FpdCB0aGlzLmdldFJvdXRlSW5mbyhyb3V0ZSxwYXRobmFtZSxxdWVyeSxhcyxyZXNvbHZlZEFzLHJvdXRlUHJvcHMpO2xldHtlcnJvcixwcm9wcyxfX05fU1NHLF9fTl9TU1B9PXJvdXRlSW5mbzsvLyBoYW5kbGUgcmVkaXJlY3Qgb24gY2xpZW50LXRyYW5zaXRpb25cbmlmKChfX05fU1NHfHxfX05fU1NQKSYmcHJvcHMpe2lmKHByb3BzLnBhZ2VQcm9wcyYmcHJvcHMucGFnZVByb3BzLl9fTl9SRURJUkVDVCl7Y29uc3QgZGVzdGluYXRpb249cHJvcHMucGFnZVByb3BzLl9fTl9SRURJUkVDVDsvLyBjaGVjayBpZiBkZXN0aW5hdGlvbiBpcyBpbnRlcm5hbCAocmVzb2x2ZXMgdG8gYSBwYWdlKSBhbmQgYXR0ZW1wdFxuLy8gY2xpZW50LW5hdmlnYXRpb24gaWYgaXQgaXMgZmFsbGluZyBiYWNrIHRvIGhhcmQgbmF2aWdhdGlvbiBpZlxuLy8gaXQncyBub3RcbmlmKGRlc3RpbmF0aW9uLnN0YXJ0c1dpdGgoJy8nKSl7Y29uc3QgcGFyc2VkSHJlZj0oMCxfcGFyc2VSZWxhdGl2ZVVybC5wYXJzZVJlbGF0aXZlVXJsKShkZXN0aW5hdGlvbik7cGFyc2VkSHJlZi5wYXRobmFtZT1yZXNvbHZlRHluYW1pY1JvdXRlKHBhcnNlZEhyZWYucGF0aG5hbWUscGFnZXMpO2NvbnN0e3VybDpuZXdVcmwsYXM6bmV3QXN9PXByZXBhcmVVcmxBcyh0aGlzLGRlc3RpbmF0aW9uLGRlc3RpbmF0aW9uKTtyZXR1cm4gdGhpcy5jaGFuZ2UobWV0aG9kLG5ld1VybCxuZXdBcyxvcHRpb25zKTt9d2luZG93LmxvY2F0aW9uLmhyZWY9ZGVzdGluYXRpb247cmV0dXJuIG5ldyBQcm9taXNlKCgpPT57fSk7fXRoaXMuaXNQcmV2aWV3PSEhcHJvcHMuX19OX1BSRVZJRVc7Ly8gaGFuZGxlIFNTRyBkYXRhIDQwNFxuaWYocHJvcHMubm90Rm91bmQ9PT1TU0dfREFUQV9OT1RfRk9VTkQpe2xldCBub3RGb3VuZFJvdXRlO3RyeXthd2FpdCB0aGlzLmZldGNoQ29tcG9uZW50KCcvNDA0Jyk7bm90Rm91bmRSb3V0ZT0nLzQwNCc7fWNhdGNoKF8pe25vdEZvdW5kUm91dGU9Jy9fZXJyb3InO31yb3V0ZUluZm89YXdhaXQgdGhpcy5nZXRSb3V0ZUluZm8obm90Rm91bmRSb3V0ZSxub3RGb3VuZFJvdXRlLHF1ZXJ5LGFzLHJlc29sdmVkQXMse3NoYWxsb3c6ZmFsc2V9KTt9fVJvdXRlci5ldmVudHMuZW1pdCgnYmVmb3JlSGlzdG9yeUNoYW5nZScsYXMscm91dGVQcm9wcyk7dGhpcy5jaGFuZ2VTdGF0ZShtZXRob2QsdXJsLGFzLG9wdGlvbnMpO2lmKHByb2Nlc3MuZW52Lk5PREVfRU5WIT09J3Byb2R1Y3Rpb24nKXtjb25zdCBhcHBDb21wPXRoaXMuY29tcG9uZW50c1snL19hcHAnXS5Db21wb25lbnQ7d2luZG93Lm5leHQuaXNQcmVyZW5kZXJlZD1hcHBDb21wLmdldEluaXRpYWxQcm9wcz09PWFwcENvbXAub3JpZ0dldEluaXRpYWxQcm9wcyYmIXJvdXRlSW5mby5Db21wb25lbnQuZ2V0SW5pdGlhbFByb3BzO31pZihvcHRpb25zLl9oJiZwYXRobmFtZT09PScvX2Vycm9yJyYmKChfc2VsZiRfX05FWFRfREFUQV9fJHA9c2VsZi5fX05FWFRfREFUQV9fLnByb3BzKT09bnVsbD92b2lkIDA6KF9zZWxmJF9fTkVYVF9EQVRBX18kcDI9X3NlbGYkX19ORVhUX0RBVEFfXyRwLnBhZ2VQcm9wcyk9PW51bGw/dm9pZCAwOl9zZWxmJF9fTkVYVF9EQVRBX18kcDIuc3RhdHVzQ29kZSk9PT01MDAmJnByb3BzIT1udWxsJiZwcm9wcy5wYWdlUHJvcHMpey8vIGVuc3VyZSBzdGF0dXNDb2RlIGlzIHN0aWxsIGNvcnJlY3QgZm9yIHN0YXRpYyA1MDAgcGFnZVxuLy8gd2hlbiB1cGRhdGluZyBxdWVyeSBpbmZvcm1hdGlvblxucHJvcHMucGFnZVByb3BzLnN0YXR1c0NvZGU9NTAwO30vLyBzaGFsbG93IHJvdXRpbmcgaXMgb25seSBhbGxvd2VkIGZvciBzYW1lIHBhZ2UgVVJMIGNoYW5nZXMuXG5jb25zdCBpc1ZhbGlkU2hhbGxvd1JvdXRlPW9wdGlvbnMuc2hhbGxvdyYmdGhpcy5yb3V0ZT09PXJvdXRlO2NvbnN0IHNob3VsZFNjcm9sbD0oX29wdGlvbnMkc2Nyb2xsPW9wdGlvbnMuc2Nyb2xsKSE9bnVsbD9fb3B0aW9ucyRzY3JvbGw6IWlzVmFsaWRTaGFsbG93Um91dGU7Y29uc3QgcmVzZXRTY3JvbGw9c2hvdWxkU2Nyb2xsP3t4OjAseTowfTpudWxsO2F3YWl0IHRoaXMuc2V0KHJvdXRlLHBhdGhuYW1lLHF1ZXJ5LGNsZWFuZWRBcyxyb3V0ZUluZm8sZm9yY2VkU2Nyb2xsIT1udWxsP2ZvcmNlZFNjcm9sbDpyZXNldFNjcm9sbCkuY2F0Y2goZT0+e2lmKGUuY2FuY2VsbGVkKWVycm9yPWVycm9yfHxlO2Vsc2UgdGhyb3cgZTt9KTtpZihlcnJvcil7Um91dGVyLmV2ZW50cy5lbWl0KCdyb3V0ZUNoYW5nZUVycm9yJyxlcnJvcixjbGVhbmVkQXMscm91dGVQcm9wcyk7dGhyb3cgZXJyb3I7fWlmKHByb2Nlc3MuZW52Ll9fTkVYVF9JMThOX1NVUFBPUlQpe2lmKHRoaXMubG9jYWxlKXtkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQubGFuZz10aGlzLmxvY2FsZTt9fVJvdXRlci5ldmVudHMuZW1pdCgncm91dGVDaGFuZ2VDb21wbGV0ZScsYXMscm91dGVQcm9wcyk7cmV0dXJuIHRydWU7fWNhdGNoKGVycil7aWYoZXJyLmNhbmNlbGxlZCl7cmV0dXJuIGZhbHNlO310aHJvdyBlcnI7fX1jaGFuZ2VTdGF0ZShtZXRob2QsdXJsLGFzLG9wdGlvbnM9e30pe2lmKHByb2Nlc3MuZW52Lk5PREVfRU5WIT09J3Byb2R1Y3Rpb24nKXtpZih0eXBlb2Ygd2luZG93Lmhpc3Rvcnk9PT0ndW5kZWZpbmVkJyl7Y29uc29sZS5lcnJvcihgV2FybmluZzogd2luZG93Lmhpc3RvcnkgaXMgbm90IGF2YWlsYWJsZS5gKTtyZXR1cm47fWlmKHR5cGVvZiB3aW5kb3cuaGlzdG9yeVttZXRob2RdPT09J3VuZGVmaW5lZCcpe2NvbnNvbGUuZXJyb3IoYFdhcm5pbmc6IHdpbmRvdy5oaXN0b3J5LiR7bWV0aG9kfSBpcyBub3QgYXZhaWxhYmxlYCk7cmV0dXJuO319aWYobWV0aG9kIT09J3B1c2hTdGF0ZSd8fCgwLF91dGlscy5nZXRVUkwpKCkhPT1hcyl7dGhpcy5fc2hhbGxvdz1vcHRpb25zLnNoYWxsb3c7d2luZG93Lmhpc3RvcnlbbWV0aG9kXSh7dXJsLGFzLG9wdGlvbnMsX19OOnRydWUsaWR4OnRoaXMuX2lkeD1tZXRob2QhPT0ncHVzaFN0YXRlJz90aGlzLl9pZHg6dGhpcy5faWR4KzF9LC8vIE1vc3QgYnJvd3NlcnMgY3VycmVudGx5IGlnbm9yZXMgdGhpcyBwYXJhbWV0ZXIsIGFsdGhvdWdoIHRoZXkgbWF5IHVzZSBpdCBpbiB0aGUgZnV0dXJlLlxuLy8gUGFzc2luZyB0aGUgZW1wdHkgc3RyaW5nIGhlcmUgc2hvdWxkIGJlIHNhZmUgYWdhaW5zdCBmdXR1cmUgY2hhbmdlcyB0byB0aGUgbWV0aG9kLlxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0hpc3RvcnkvcmVwbGFjZVN0YXRlXG4nJyxhcyk7fX1hc3luYyBoYW5kbGVSb3V0ZUluZm9FcnJvcihlcnIscGF0aG5hbWUscXVlcnksYXMscm91dGVQcm9wcyxsb2FkRXJyb3JGYWlsKXtpZihlcnIuY2FuY2VsbGVkKXsvLyBidWJibGUgdXAgY2FuY2VsbGF0aW9uIGVycm9yc1xudGhyb3cgZXJyO31pZigoMCxfcm91dGVMb2FkZXIuaXNBc3NldEVycm9yKShlcnIpfHxsb2FkRXJyb3JGYWlsKXtSb3V0ZXIuZXZlbnRzLmVtaXQoJ3JvdXRlQ2hhbmdlRXJyb3InLGVycixhcyxyb3V0ZVByb3BzKTsvLyBJZiB3ZSBjYW4ndCBsb2FkIHRoZSBwYWdlIGl0IGNvdWxkIGJlIG9uZSBvZiBmb2xsb3dpbmcgcmVhc29uc1xuLy8gIDEuIFBhZ2UgZG9lc24ndCBleGlzdHNcbi8vICAyLiBQYWdlIGRvZXMgZXhpc3QgaW4gYSBkaWZmZXJlbnQgem9uZVxuLy8gIDMuIEludGVybmFsIGVycm9yIHdoaWxlIGxvYWRpbmcgdGhlIHBhZ2Vcbi8vIFNvLCBkb2luZyBhIGhhcmQgcmVsb2FkIGlzIHRoZSBwcm9wZXIgd2F5IHRvIGRlYWwgd2l0aCB0aGlzLlxud2luZG93LmxvY2F0aW9uLmhyZWY9YXM7Ly8gQ2hhbmdpbmcgdGhlIFVSTCBkb2Vzbid0IGJsb2NrIGV4ZWN1dGluZyB0aGUgY3VycmVudCBjb2RlIHBhdGguXG4vLyBTbyBsZXQncyB0aHJvdyBhIGNhbmNlbGxhdGlvbiBlcnJvciBzdG9wIHRoZSByb3V0aW5nIGxvZ2ljLlxudGhyb3cgYnVpbGRDYW5jZWxsYXRpb25FcnJvcigpO310cnl7bGV0IENvbXBvbmVudDtsZXQgc3R5bGVTaGVldHM7bGV0IHByb3BzO2lmKHR5cGVvZiBDb21wb25lbnQ9PT0ndW5kZWZpbmVkJ3x8dHlwZW9mIHN0eWxlU2hlZXRzPT09J3VuZGVmaW5lZCcpezsoe3BhZ2U6Q29tcG9uZW50LHN0eWxlU2hlZXRzfT1hd2FpdCB0aGlzLmZldGNoQ29tcG9uZW50KCcvX2Vycm9yJykpO31jb25zdCByb3V0ZUluZm89e3Byb3BzLENvbXBvbmVudCxzdHlsZVNoZWV0cyxlcnIsZXJyb3I6ZXJyfTtpZighcm91dGVJbmZvLnByb3BzKXt0cnl7cm91dGVJbmZvLnByb3BzPWF3YWl0IHRoaXMuZ2V0SW5pdGlhbFByb3BzKENvbXBvbmVudCx7ZXJyLHBhdGhuYW1lLHF1ZXJ5fSk7fWNhdGNoKGdpcEVycil7Y29uc29sZS5lcnJvcignRXJyb3IgaW4gZXJyb3IgcGFnZSBgZ2V0SW5pdGlhbFByb3BzYDogJyxnaXBFcnIpO3JvdXRlSW5mby5wcm9wcz17fTt9fXJldHVybiByb3V0ZUluZm87fWNhdGNoKHJvdXRlSW5mb0Vycil7cmV0dXJuIHRoaXMuaGFuZGxlUm91dGVJbmZvRXJyb3Iocm91dGVJbmZvRXJyLHBhdGhuYW1lLHF1ZXJ5LGFzLHJvdXRlUHJvcHMsdHJ1ZSk7fX1hc3luYyBnZXRSb3V0ZUluZm8ocm91dGUscGF0aG5hbWUscXVlcnksYXMscmVzb2x2ZWRBcyxyb3V0ZVByb3BzKXt0cnl7Y29uc3QgZXhpc3RpbmdSb3V0ZUluZm89dGhpcy5jb21wb25lbnRzW3JvdXRlXTtpZihyb3V0ZVByb3BzLnNoYWxsb3cmJmV4aXN0aW5nUm91dGVJbmZvJiZ0aGlzLnJvdXRlPT09cm91dGUpe3JldHVybiBleGlzdGluZ1JvdXRlSW5mbzt9Y29uc3QgY2FjaGVkUm91dGVJbmZvPWV4aXN0aW5nUm91dGVJbmZvJiYnaW5pdGlhbCdpbiBleGlzdGluZ1JvdXRlSW5mbz91bmRlZmluZWQ6ZXhpc3RpbmdSb3V0ZUluZm87Y29uc3Qgcm91dGVJbmZvPWNhY2hlZFJvdXRlSW5mbz9jYWNoZWRSb3V0ZUluZm86YXdhaXQgdGhpcy5mZXRjaENvbXBvbmVudChyb3V0ZSkudGhlbihyZXM9Pih7Q29tcG9uZW50OnJlcy5wYWdlLHN0eWxlU2hlZXRzOnJlcy5zdHlsZVNoZWV0cyxfX05fU1NHOnJlcy5tb2QuX19OX1NTRyxfX05fU1NQOnJlcy5tb2QuX19OX1NTUH0pKTtjb25zdHtDb21wb25lbnQsX19OX1NTRyxfX05fU1NQfT1yb3V0ZUluZm87aWYocHJvY2Vzcy5lbnYuTk9ERV9FTlYhPT0ncHJvZHVjdGlvbicpe2NvbnN0e2lzVmFsaWRFbGVtZW50VHlwZX09cmVxdWlyZSgncmVhY3QtaXMnKTtpZighaXNWYWxpZEVsZW1lbnRUeXBlKENvbXBvbmVudCkpe3Rocm93IG5ldyBFcnJvcihgVGhlIGRlZmF1bHQgZXhwb3J0IGlzIG5vdCBhIFJlYWN0IENvbXBvbmVudCBpbiBwYWdlOiBcIiR7cGF0aG5hbWV9XCJgKTt9fWxldCBkYXRhSHJlZjtpZihfX05fU1NHfHxfX05fU1NQKXtkYXRhSHJlZj10aGlzLnBhZ2VMb2FkZXIuZ2V0RGF0YUhyZWYoKDAsX3V0aWxzLmZvcm1hdFdpdGhWYWxpZGF0aW9uKSh7cGF0aG5hbWUscXVlcnl9KSxyZXNvbHZlZEFzLF9fTl9TU0csdGhpcy5sb2NhbGUpO31jb25zdCBwcm9wcz1hd2FpdCB0aGlzLl9nZXREYXRhKCgpPT5fX05fU1NHP3RoaXMuX2dldFN0YXRpY0RhdGEoZGF0YUhyZWYpOl9fTl9TU1A/dGhpcy5fZ2V0U2VydmVyRGF0YShkYXRhSHJlZik6dGhpcy5nZXRJbml0aWFsUHJvcHMoQ29tcG9uZW50LC8vIHdlIHByb3ZpZGUgQXBwVHJlZSBsYXRlciBzbyB0aGlzIG5lZWRzIHRvIGJlIGBhbnlgXG57cGF0aG5hbWUscXVlcnksYXNQYXRoOmFzLGxvY2FsZTp0aGlzLmxvY2FsZSxsb2NhbGVzOnRoaXMubG9jYWxlcyxkZWZhdWx0TG9jYWxlOnRoaXMuZGVmYXVsdExvY2FsZX0pKTtyb3V0ZUluZm8ucHJvcHM9cHJvcHM7dGhpcy5jb21wb25lbnRzW3JvdXRlXT1yb3V0ZUluZm87cmV0dXJuIHJvdXRlSW5mbzt9Y2F0Y2goZXJyKXtyZXR1cm4gdGhpcy5oYW5kbGVSb3V0ZUluZm9FcnJvcihlcnIscGF0aG5hbWUscXVlcnksYXMscm91dGVQcm9wcyk7fX1zZXQocm91dGUscGF0aG5hbWUscXVlcnksYXMsZGF0YSxyZXNldFNjcm9sbCl7dGhpcy5pc0ZhbGxiYWNrPWZhbHNlO3RoaXMucm91dGU9cm91dGU7dGhpcy5wYXRobmFtZT1wYXRobmFtZTt0aGlzLnF1ZXJ5PXF1ZXJ5O3RoaXMuYXNQYXRoPWFzO3JldHVybiB0aGlzLm5vdGlmeShkYXRhLHJlc2V0U2Nyb2xsKTt9LyoqXG4gICAqIENhbGxiYWNrIHRvIGV4ZWN1dGUgYmVmb3JlIHJlcGxhY2luZyByb3V0ZXIgc3RhdGVcbiAgICogQHBhcmFtIGNiIGNhbGxiYWNrIHRvIGJlIGV4ZWN1dGVkXG4gICAqL2JlZm9yZVBvcFN0YXRlKGNiKXt0aGlzLl9icHM9Y2I7fW9ubHlBSGFzaENoYW5nZShhcyl7aWYoIXRoaXMuYXNQYXRoKXJldHVybiBmYWxzZTtjb25zdFtvbGRVcmxOb0hhc2gsb2xkSGFzaF09dGhpcy5hc1BhdGguc3BsaXQoJyMnKTtjb25zdFtuZXdVcmxOb0hhc2gsbmV3SGFzaF09YXMuc3BsaXQoJyMnKTsvLyBNYWtlcyBzdXJlIHdlIHNjcm9sbCB0byB0aGUgcHJvdmlkZWQgaGFzaCBpZiB0aGUgdXJsL2hhc2ggYXJlIHRoZSBzYW1lXG5pZihuZXdIYXNoJiZvbGRVcmxOb0hhc2g9PT1uZXdVcmxOb0hhc2gmJm9sZEhhc2g9PT1uZXdIYXNoKXtyZXR1cm4gdHJ1ZTt9Ly8gSWYgdGhlIHVybHMgYXJlIGNoYW5nZSwgdGhlcmUncyBtb3JlIHRoYW4gYSBoYXNoIGNoYW5nZVxuaWYob2xkVXJsTm9IYXNoIT09bmV3VXJsTm9IYXNoKXtyZXR1cm4gZmFsc2U7fS8vIElmIHRoZSBoYXNoIGhhcyBjaGFuZ2VkLCB0aGVuIGl0J3MgYSBoYXNoIG9ubHkgY2hhbmdlLlxuLy8gVGhpcyBjaGVjayBpcyBuZWNlc3NhcnkgdG8gaGFuZGxlIGJvdGggdGhlIGVudGVyIGFuZFxuLy8gbGVhdmUgaGFzaCA9PT0gJycgY2FzZXMuIFRoZSBpZGVudGl0eSBjYXNlIGZhbGxzIHRocm91Z2hcbi8vIGFuZCBpcyB0cmVhdGVkIGFzIGEgbmV4dCByZWxvYWQuXG5yZXR1cm4gb2xkSGFzaCE9PW5ld0hhc2g7fXNjcm9sbFRvSGFzaChhcyl7Y29uc3RbLGhhc2hdPWFzLnNwbGl0KCcjJyk7Ly8gU2Nyb2xsIHRvIHRvcCBpZiB0aGUgaGFzaCBpcyBqdXN0IGAjYCB3aXRoIG5vIHZhbHVlIG9yIGAjdG9wYFxuLy8gVG8gbWlycm9yIGJyb3dzZXJzXG5pZihoYXNoPT09Jyd8fGhhc2g9PT0ndG9wJyl7d2luZG93LnNjcm9sbFRvKDAsMCk7cmV0dXJuO30vLyBGaXJzdCB3ZSBjaGVjayBpZiB0aGUgZWxlbWVudCBieSBpZCBpcyBmb3VuZFxuY29uc3QgaWRFbD1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChoYXNoKTtpZihpZEVsKXtpZEVsLnNjcm9sbEludG9WaWV3KCk7cmV0dXJuO30vLyBJZiB0aGVyZSdzIG5vIGVsZW1lbnQgd2l0aCB0aGUgaWQsIHdlIGNoZWNrIHRoZSBgbmFtZWAgcHJvcGVydHlcbi8vIFRvIG1pcnJvciBicm93c2Vyc1xuY29uc3QgbmFtZUVsPWRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKGhhc2gpWzBdO2lmKG5hbWVFbCl7bmFtZUVsLnNjcm9sbEludG9WaWV3KCk7fX11cmxJc05ldyhhc1BhdGgpe3JldHVybiB0aGlzLmFzUGF0aCE9PWFzUGF0aDt9LyoqXG4gICAqIFByZWZldGNoIHBhZ2UgY29kZSwgeW91IG1heSB3YWl0IGZvciB0aGUgZGF0YSBkdXJpbmcgcGFnZSByZW5kZXJpbmcuXG4gICAqIFRoaXMgZmVhdHVyZSBvbmx5IHdvcmtzIGluIHByb2R1Y3Rpb24hXG4gICAqIEBwYXJhbSB1cmwgdGhlIGhyZWYgb2YgcHJlZmV0Y2hlZCBwYWdlXG4gICAqIEBwYXJhbSBhc1BhdGggdGhlIGFzIHBhdGggb2YgdGhlIHByZWZldGNoZWQgcGFnZVxuICAgKi9hc3luYyBwcmVmZXRjaCh1cmwsYXNQYXRoPXVybCxvcHRpb25zPXt9KXtsZXQgcGFyc2VkPSgwLF9wYXJzZVJlbGF0aXZlVXJsLnBhcnNlUmVsYXRpdmVVcmwpKHVybCk7bGV0e3BhdGhuYW1lfT1wYXJzZWQ7aWYocHJvY2Vzcy5lbnYuX19ORVhUX0kxOE5fU1VQUE9SVCl7aWYob3B0aW9ucy5sb2NhbGU9PT1mYWxzZSl7cGF0aG5hbWU9KDAsX25vcm1hbGl6ZUxvY2FsZVBhdGgubm9ybWFsaXplTG9jYWxlUGF0aCkocGF0aG5hbWUsdGhpcy5sb2NhbGVzKS5wYXRobmFtZTtwYXJzZWQucGF0aG5hbWU9cGF0aG5hbWU7dXJsPSgwLF91dGlscy5mb3JtYXRXaXRoVmFsaWRhdGlvbikocGFyc2VkKTtsZXQgcGFyc2VkQXM9KDAsX3BhcnNlUmVsYXRpdmVVcmwucGFyc2VSZWxhdGl2ZVVybCkoYXNQYXRoKTtjb25zdCBsb2NhbGVQYXRoUmVzdWx0PSgwLF9ub3JtYWxpemVMb2NhbGVQYXRoLm5vcm1hbGl6ZUxvY2FsZVBhdGgpKHBhcnNlZEFzLnBhdGhuYW1lLHRoaXMubG9jYWxlcyk7cGFyc2VkQXMucGF0aG5hbWU9bG9jYWxlUGF0aFJlc3VsdC5wYXRobmFtZTtvcHRpb25zLmxvY2FsZT1sb2NhbGVQYXRoUmVzdWx0LmRldGVjdGVkTG9jYWxlfHx0aGlzLmRlZmF1bHRMb2NhbGU7YXNQYXRoPSgwLF91dGlscy5mb3JtYXRXaXRoVmFsaWRhdGlvbikocGFyc2VkQXMpO319Y29uc3QgcGFnZXM9YXdhaXQgdGhpcy5wYWdlTG9hZGVyLmdldFBhZ2VMaXN0KCk7bGV0IHJlc29sdmVkQXM9YXNQYXRoO2lmKHByb2Nlc3MuZW52Ll9fTkVYVF9IQVNfUkVXUklURVMmJmFzUGF0aC5zdGFydHNXaXRoKCcvJykpe2xldCByZXdyaXRlczsoe19fcmV3cml0ZXM6cmV3cml0ZXN9PWF3YWl0KDAsX3JvdXRlTG9hZGVyLmdldENsaWVudEJ1aWxkTWFuaWZlc3QpKCkpO2NvbnN0IHJld3JpdGVzUmVzdWx0PSgwLF9yZXNvbHZlUmV3cml0ZXMuZGVmYXVsdCkoYWRkQmFzZVBhdGgoYWRkTG9jYWxlKGFzUGF0aCx0aGlzLmxvY2FsZSkpLHBhZ2VzLHJld3JpdGVzLHBhcnNlZC5xdWVyeSxwPT5yZXNvbHZlRHluYW1pY1JvdXRlKHAscGFnZXMpLHRoaXMubG9jYWxlcyk7cmVzb2x2ZWRBcz1kZWxMb2NhbGUoZGVsQmFzZVBhdGgocmV3cml0ZXNSZXN1bHQuYXNQYXRoKSx0aGlzLmxvY2FsZSk7aWYocmV3cml0ZXNSZXN1bHQubWF0Y2hlZFBhZ2UmJnJld3JpdGVzUmVzdWx0LnJlc29sdmVkSHJlZil7Ly8gaWYgdGhpcyBkaXJlY3RseSBtYXRjaGVzIGEgcGFnZSB3ZSBuZWVkIHRvIHVwZGF0ZSB0aGUgaHJlZiB0b1xuLy8gYWxsb3cgdGhlIGNvcnJlY3QgcGFnZSBjaHVuayB0byBiZSBsb2FkZWRcbnBhdGhuYW1lPXJld3JpdGVzUmVzdWx0LnJlc29sdmVkSHJlZjtwYXJzZWQucGF0aG5hbWU9cGF0aG5hbWU7dXJsPSgwLF91dGlscy5mb3JtYXRXaXRoVmFsaWRhdGlvbikocGFyc2VkKTt9fWVsc2V7cGFyc2VkLnBhdGhuYW1lPXJlc29sdmVEeW5hbWljUm91dGUocGFyc2VkLnBhdGhuYW1lLHBhZ2VzKTtpZihwYXJzZWQucGF0aG5hbWUhPT1wYXRobmFtZSl7cGF0aG5hbWU9cGFyc2VkLnBhdGhuYW1lO3BhcnNlZC5wYXRobmFtZT1wYXRobmFtZTt1cmw9KDAsX3V0aWxzLmZvcm1hdFdpdGhWYWxpZGF0aW9uKShwYXJzZWQpO319Y29uc3Qgcm91dGU9KDAsX25vcm1hbGl6ZVRyYWlsaW5nU2xhc2gucmVtb3ZlUGF0aFRyYWlsaW5nU2xhc2gpKHBhdGhuYW1lKTsvLyBQcmVmZXRjaCBpcyBub3Qgc3VwcG9ydGVkIGluIGRldmVsb3BtZW50IG1vZGUgYmVjYXVzZSBpdCB3b3VsZCB0cmlnZ2VyIG9uLWRlbWFuZC1lbnRyaWVzXG5pZihwcm9jZXNzLmVudi5OT0RFX0VOViE9PSdwcm9kdWN0aW9uJyl7cmV0dXJuO31hd2FpdCBQcm9taXNlLmFsbChbdGhpcy5wYWdlTG9hZGVyLl9pc1NzZyhyb3V0ZSkudGhlbihpc1NzZz0+e3JldHVybiBpc1NzZz90aGlzLl9nZXRTdGF0aWNEYXRhKHRoaXMucGFnZUxvYWRlci5nZXREYXRhSHJlZih1cmwscmVzb2x2ZWRBcyx0cnVlLHR5cGVvZiBvcHRpb25zLmxvY2FsZSE9PSd1bmRlZmluZWQnP29wdGlvbnMubG9jYWxlOnRoaXMubG9jYWxlKSk6ZmFsc2U7fSksdGhpcy5wYWdlTG9hZGVyW29wdGlvbnMucHJpb3JpdHk/J2xvYWRQYWdlJzoncHJlZmV0Y2gnXShyb3V0ZSldKTt9YXN5bmMgZmV0Y2hDb21wb25lbnQocm91dGUpe2xldCBjYW5jZWxsZWQ9ZmFsc2U7Y29uc3QgY2FuY2VsPXRoaXMuY2xjPSgpPT57Y2FuY2VsbGVkPXRydWU7fTtjb25zdCBjb21wb25lbnRSZXN1bHQ9YXdhaXQgdGhpcy5wYWdlTG9hZGVyLmxvYWRQYWdlKHJvdXRlKTtpZihjYW5jZWxsZWQpe2NvbnN0IGVycm9yPW5ldyBFcnJvcihgQWJvcnQgZmV0Y2hpbmcgY29tcG9uZW50IGZvciByb3V0ZTogXCIke3JvdXRlfVwiYCk7ZXJyb3IuY2FuY2VsbGVkPXRydWU7dGhyb3cgZXJyb3I7fWlmKGNhbmNlbD09PXRoaXMuY2xjKXt0aGlzLmNsYz1udWxsO31yZXR1cm4gY29tcG9uZW50UmVzdWx0O31fZ2V0RGF0YShmbil7bGV0IGNhbmNlbGxlZD1mYWxzZTtjb25zdCBjYW5jZWw9KCk9PntjYW5jZWxsZWQ9dHJ1ZTt9O3RoaXMuY2xjPWNhbmNlbDtyZXR1cm4gZm4oKS50aGVuKGRhdGE9PntpZihjYW5jZWw9PT10aGlzLmNsYyl7dGhpcy5jbGM9bnVsbDt9aWYoY2FuY2VsbGVkKXtjb25zdCBlcnI9bmV3IEVycm9yKCdMb2FkaW5nIGluaXRpYWwgcHJvcHMgY2FuY2VsbGVkJyk7ZXJyLmNhbmNlbGxlZD10cnVlO3Rocm93IGVycjt9cmV0dXJuIGRhdGE7fSk7fV9nZXRTdGF0aWNEYXRhKGRhdGFIcmVmKXtjb25zdHtocmVmOmNhY2hlS2V5fT1uZXcgVVJMKGRhdGFIcmVmLHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtpZihwcm9jZXNzLmVudi5OT0RFX0VOVj09PSdwcm9kdWN0aW9uJyYmIXRoaXMuaXNQcmV2aWV3JiZ0aGlzLnNkY1tjYWNoZUtleV0pe3JldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5zZGNbY2FjaGVLZXldKTt9cmV0dXJuIGZldGNoTmV4dERhdGEoZGF0YUhyZWYsdGhpcy5pc1NzcikudGhlbihkYXRhPT57dGhpcy5zZGNbY2FjaGVLZXldPWRhdGE7cmV0dXJuIGRhdGE7fSk7fV9nZXRTZXJ2ZXJEYXRhKGRhdGFIcmVmKXtjb25zdHtocmVmOnJlc291cmNlS2V5fT1uZXcgVVJMKGRhdGFIcmVmLHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtpZih0aGlzLnNkcltyZXNvdXJjZUtleV0pe3JldHVybiB0aGlzLnNkcltyZXNvdXJjZUtleV07fXJldHVybiB0aGlzLnNkcltyZXNvdXJjZUtleV09ZmV0Y2hOZXh0RGF0YShkYXRhSHJlZix0aGlzLmlzU3NyKS50aGVuKGRhdGE9PntkZWxldGUgdGhpcy5zZHJbcmVzb3VyY2VLZXldO3JldHVybiBkYXRhO30pLmNhdGNoKGVycj0+e2RlbGV0ZSB0aGlzLnNkcltyZXNvdXJjZUtleV07dGhyb3cgZXJyO30pO31nZXRJbml0aWFsUHJvcHMoQ29tcG9uZW50LGN0eCl7Y29uc3R7Q29tcG9uZW50OkFwcH09dGhpcy5jb21wb25lbnRzWycvX2FwcCddO2NvbnN0IEFwcFRyZWU9dGhpcy5fd3JhcEFwcChBcHApO2N0eC5BcHBUcmVlPUFwcFRyZWU7cmV0dXJuKDAsX3V0aWxzLmxvYWRHZXRJbml0aWFsUHJvcHMpKEFwcCx7QXBwVHJlZSxDb21wb25lbnQscm91dGVyOnRoaXMsY3R4fSk7fWFib3J0Q29tcG9uZW50TG9hZChhcyxyb3V0ZVByb3BzKXtpZih0aGlzLmNsYyl7Um91dGVyLmV2ZW50cy5lbWl0KCdyb3V0ZUNoYW5nZUVycm9yJyxidWlsZENhbmNlbGxhdGlvbkVycm9yKCksYXMscm91dGVQcm9wcyk7dGhpcy5jbGMoKTt0aGlzLmNsYz1udWxsO319bm90aWZ5KGRhdGEscmVzZXRTY3JvbGwpe3JldHVybiB0aGlzLnN1YihkYXRhLHRoaXMuY29tcG9uZW50c1snL19hcHAnXS5Db21wb25lbnQscmVzZXRTY3JvbGwpO319ZXhwb3J0cy5kZWZhdWx0PVJvdXRlcjtSb3V0ZXIuZXZlbnRzPSgwLF9taXR0LmRlZmF1bHQpKCk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1yb3V0ZXIuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7ZXhwb3J0cy5fX2VzTW9kdWxlPXRydWU7ZXhwb3J0cy5mb3JtYXRVcmw9Zm9ybWF0VXJsO3ZhciBxdWVyeXN0cmluZz1faW50ZXJvcFJlcXVpcmVXaWxkY2FyZChyZXF1aXJlKFwiLi9xdWVyeXN0cmluZ1wiKSk7ZnVuY3Rpb24gX2dldFJlcXVpcmVXaWxkY2FyZENhY2hlKCl7aWYodHlwZW9mIFdlYWtNYXAhPT1cImZ1bmN0aW9uXCIpcmV0dXJuIG51bGw7dmFyIGNhY2hlPW5ldyBXZWFrTWFwKCk7X2dldFJlcXVpcmVXaWxkY2FyZENhY2hlPWZ1bmN0aW9uKCl7cmV0dXJuIGNhY2hlO307cmV0dXJuIGNhY2hlO31mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmope2lmKG9iaiYmb2JqLl9fZXNNb2R1bGUpe3JldHVybiBvYmo7fWlmKG9iaj09PW51bGx8fHR5cGVvZiBvYmohPT1cIm9iamVjdFwiJiZ0eXBlb2Ygb2JqIT09XCJmdW5jdGlvblwiKXtyZXR1cm57ZGVmYXVsdDpvYmp9O312YXIgY2FjaGU9X2dldFJlcXVpcmVXaWxkY2FyZENhY2hlKCk7aWYoY2FjaGUmJmNhY2hlLmhhcyhvYmopKXtyZXR1cm4gY2FjaGUuZ2V0KG9iaik7fXZhciBuZXdPYmo9e307dmFyIGhhc1Byb3BlcnR5RGVzY3JpcHRvcj1PYmplY3QuZGVmaW5lUHJvcGVydHkmJk9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7Zm9yKHZhciBrZXkgaW4gb2JqKXtpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLGtleSkpe3ZhciBkZXNjPWhhc1Byb3BlcnR5RGVzY3JpcHRvcj9PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaixrZXkpOm51bGw7aWYoZGVzYyYmKGRlc2MuZ2V0fHxkZXNjLnNldCkpe09iamVjdC5kZWZpbmVQcm9wZXJ0eShuZXdPYmosa2V5LGRlc2MpO31lbHNle25ld09ialtrZXldPW9ialtrZXldO319fW5ld09iai5kZWZhdWx0PW9iajtpZihjYWNoZSl7Y2FjaGUuc2V0KG9iaixuZXdPYmopO31yZXR1cm4gbmV3T2JqO30vLyBGb3JtYXQgZnVuY3Rpb24gbW9kaWZpZWQgZnJvbSBub2RlanNcbi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuY29uc3Qgc2xhc2hlZFByb3RvY29scz0vaHR0cHM/fGZ0cHxnb3BoZXJ8ZmlsZS87ZnVuY3Rpb24gZm9ybWF0VXJsKHVybE9iail7bGV0e2F1dGgsaG9zdG5hbWV9PXVybE9iajtsZXQgcHJvdG9jb2w9dXJsT2JqLnByb3RvY29sfHwnJztsZXQgcGF0aG5hbWU9dXJsT2JqLnBhdGhuYW1lfHwnJztsZXQgaGFzaD11cmxPYmouaGFzaHx8Jyc7bGV0IHF1ZXJ5PXVybE9iai5xdWVyeXx8Jyc7bGV0IGhvc3Q9ZmFsc2U7YXV0aD1hdXRoP2VuY29kZVVSSUNvbXBvbmVudChhdXRoKS5yZXBsYWNlKC8lM0EvaSwnOicpKydAJzonJztpZih1cmxPYmouaG9zdCl7aG9zdD1hdXRoK3VybE9iai5ob3N0O31lbHNlIGlmKGhvc3RuYW1lKXtob3N0PWF1dGgrKH5ob3N0bmFtZS5pbmRleE9mKCc6Jyk/YFske2hvc3RuYW1lfV1gOmhvc3RuYW1lKTtpZih1cmxPYmoucG9ydCl7aG9zdCs9JzonK3VybE9iai5wb3J0O319aWYocXVlcnkmJnR5cGVvZiBxdWVyeT09PSdvYmplY3QnKXtxdWVyeT1TdHJpbmcocXVlcnlzdHJpbmcudXJsUXVlcnlUb1NlYXJjaFBhcmFtcyhxdWVyeSkpO31sZXQgc2VhcmNoPXVybE9iai5zZWFyY2h8fHF1ZXJ5JiZgPyR7cXVlcnl9YHx8Jyc7aWYocHJvdG9jb2wmJnByb3RvY29sLnN1YnN0cigtMSkhPT0nOicpcHJvdG9jb2wrPSc6JztpZih1cmxPYmouc2xhc2hlc3x8KCFwcm90b2NvbHx8c2xhc2hlZFByb3RvY29scy50ZXN0KHByb3RvY29sKSkmJmhvc3QhPT1mYWxzZSl7aG9zdD0nLy8nKyhob3N0fHwnJyk7aWYocGF0aG5hbWUmJnBhdGhuYW1lWzBdIT09Jy8nKXBhdGhuYW1lPScvJytwYXRobmFtZTt9ZWxzZSBpZighaG9zdCl7aG9zdD0nJzt9aWYoaGFzaCYmaGFzaFswXSE9PScjJyloYXNoPScjJytoYXNoO2lmKHNlYXJjaCYmc2VhcmNoWzBdIT09Jz8nKXNlYXJjaD0nPycrc2VhcmNoO3BhdGhuYW1lPXBhdGhuYW1lLnJlcGxhY2UoL1s/I10vZyxlbmNvZGVVUklDb21wb25lbnQpO3NlYXJjaD1zZWFyY2gucmVwbGFjZSgnIycsJyUyMycpO3JldHVybmAke3Byb3RvY29sfSR7aG9zdH0ke3BhdGhuYW1lfSR7c2VhcmNofSR7aGFzaH1gO31cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZvcm1hdC11cmwuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7ZXhwb3J0cy5fX2VzTW9kdWxlPXRydWU7ZXhwb3J0cy5pc0R5bmFtaWNSb3V0ZT1pc0R5bmFtaWNSb3V0ZTsvLyBJZGVudGlmeSAvW3BhcmFtXS8gaW4gcm91dGUgc3RyaW5nXG5jb25zdCBURVNUX1JPVVRFPS9cXC9cXFtbXi9dKz9cXF0oPz1cXC98JCkvO2Z1bmN0aW9uIGlzRHluYW1pY1JvdXRlKHJvdXRlKXtyZXR1cm4gVEVTVF9ST1VURS50ZXN0KHJvdXRlKTt9XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pcy1keW5hbWljLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO2V4cG9ydHMuX19lc01vZHVsZT10cnVlO2V4cG9ydHMucGFyc2VSZWxhdGl2ZVVybD1wYXJzZVJlbGF0aXZlVXJsO3ZhciBfdXRpbHM9cmVxdWlyZShcIi4uLy4uL3V0aWxzXCIpO3ZhciBfcXVlcnlzdHJpbmc9cmVxdWlyZShcIi4vcXVlcnlzdHJpbmdcIik7LyoqXG4gKiBQYXJzZXMgcGF0aC1yZWxhdGl2ZSB1cmxzIChlLmcuIGAvaGVsbG8vd29ybGQ/Zm9vPWJhcmApLiBJZiB1cmwgaXNuJ3QgcGF0aC1yZWxhdGl2ZVxuICogKGUuZy4gYC4vaGVsbG9gKSB0aGVuIGF0IGxlYXN0IGJhc2UgbXVzdCBiZS5cbiAqIEFic29sdXRlIHVybHMgYXJlIHJlamVjdGVkIHdpdGggb25lIGV4Y2VwdGlvbiwgaW4gdGhlIGJyb3dzZXIsIGFic29sdXRlIHVybHMgdGhhdCBhcmUgb25cbiAqIHRoZSBjdXJyZW50IG9yaWdpbiB3aWxsIGJlIHBhcnNlZCBhcyByZWxhdGl2ZVxuICovZnVuY3Rpb24gcGFyc2VSZWxhdGl2ZVVybCh1cmwsYmFzZSl7Y29uc3QgZ2xvYmFsQmFzZT1uZXcgVVJMKHR5cGVvZiB3aW5kb3c9PT0ndW5kZWZpbmVkJz8naHR0cDovL24nOigwLF91dGlscy5nZXRMb2NhdGlvbk9yaWdpbikoKSk7Y29uc3QgcmVzb2x2ZWRCYXNlPWJhc2U/bmV3IFVSTChiYXNlLGdsb2JhbEJhc2UpOmdsb2JhbEJhc2U7Y29uc3R7cGF0aG5hbWUsc2VhcmNoUGFyYW1zLHNlYXJjaCxoYXNoLGhyZWYsb3JpZ2lufT1uZXcgVVJMKHVybCxyZXNvbHZlZEJhc2UpO2lmKG9yaWdpbiE9PWdsb2JhbEJhc2Uub3JpZ2luKXt0aHJvdyBuZXcgRXJyb3IoYGludmFyaWFudDogaW52YWxpZCByZWxhdGl2ZSBVUkwsIHJvdXRlciByZWNlaXZlZCAke3VybH1gKTt9cmV0dXJue3BhdGhuYW1lLHF1ZXJ5OigwLF9xdWVyeXN0cmluZy5zZWFyY2hQYXJhbXNUb1VybFF1ZXJ5KShzZWFyY2hQYXJhbXMpLHNlYXJjaCxoYXNoLGhyZWY6aHJlZi5zbGljZShnbG9iYWxCYXNlLm9yaWdpbi5sZW5ndGgpfTt9XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wYXJzZS1yZWxhdGl2ZS11cmwuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7ZXhwb3J0cy5fX2VzTW9kdWxlPXRydWU7ZXhwb3J0cy5zZWFyY2hQYXJhbXNUb1VybFF1ZXJ5PXNlYXJjaFBhcmFtc1RvVXJsUXVlcnk7ZXhwb3J0cy51cmxRdWVyeVRvU2VhcmNoUGFyYW1zPXVybFF1ZXJ5VG9TZWFyY2hQYXJhbXM7ZXhwb3J0cy5hc3NpZ249YXNzaWduO2Z1bmN0aW9uIHNlYXJjaFBhcmFtc1RvVXJsUXVlcnkoc2VhcmNoUGFyYW1zKXtjb25zdCBxdWVyeT17fTtzZWFyY2hQYXJhbXMuZm9yRWFjaCgodmFsdWUsa2V5KT0+e2lmKHR5cGVvZiBxdWVyeVtrZXldPT09J3VuZGVmaW5lZCcpe3F1ZXJ5W2tleV09dmFsdWU7fWVsc2UgaWYoQXJyYXkuaXNBcnJheShxdWVyeVtrZXldKSl7O3F1ZXJ5W2tleV0ucHVzaCh2YWx1ZSk7fWVsc2V7cXVlcnlba2V5XT1bcXVlcnlba2V5XSx2YWx1ZV07fX0pO3JldHVybiBxdWVyeTt9ZnVuY3Rpb24gc3RyaW5naWZ5VXJsUXVlcnlQYXJhbShwYXJhbSl7aWYodHlwZW9mIHBhcmFtPT09J3N0cmluZyd8fHR5cGVvZiBwYXJhbT09PSdudW1iZXInJiYhaXNOYU4ocGFyYW0pfHx0eXBlb2YgcGFyYW09PT0nYm9vbGVhbicpe3JldHVybiBTdHJpbmcocGFyYW0pO31lbHNle3JldHVybicnO319ZnVuY3Rpb24gdXJsUXVlcnlUb1NlYXJjaFBhcmFtcyh1cmxRdWVyeSl7Y29uc3QgcmVzdWx0PW5ldyBVUkxTZWFyY2hQYXJhbXMoKTtPYmplY3QuZW50cmllcyh1cmxRdWVyeSkuZm9yRWFjaCgoW2tleSx2YWx1ZV0pPT57aWYoQXJyYXkuaXNBcnJheSh2YWx1ZSkpe3ZhbHVlLmZvckVhY2goaXRlbT0+cmVzdWx0LmFwcGVuZChrZXksc3RyaW5naWZ5VXJsUXVlcnlQYXJhbShpdGVtKSkpO31lbHNle3Jlc3VsdC5zZXQoa2V5LHN0cmluZ2lmeVVybFF1ZXJ5UGFyYW0odmFsdWUpKTt9fSk7cmV0dXJuIHJlc3VsdDt9ZnVuY3Rpb24gYXNzaWduKHRhcmdldCwuLi5zZWFyY2hQYXJhbXNMaXN0KXtzZWFyY2hQYXJhbXNMaXN0LmZvckVhY2goc2VhcmNoUGFyYW1zPT57QXJyYXkuZnJvbShzZWFyY2hQYXJhbXMua2V5cygpKS5mb3JFYWNoKGtleT0+dGFyZ2V0LmRlbGV0ZShrZXkpKTtzZWFyY2hQYXJhbXMuZm9yRWFjaCgodmFsdWUsa2V5KT0+dGFyZ2V0LmFwcGVuZChrZXksdmFsdWUpKTt9KTtyZXR1cm4gdGFyZ2V0O31cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXF1ZXJ5c3RyaW5nLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO2V4cG9ydHMuX19lc01vZHVsZT10cnVlO2V4cG9ydHMuZ2V0Um91dGVNYXRjaGVyPWdldFJvdXRlTWF0Y2hlcjtmdW5jdGlvbiBnZXRSb3V0ZU1hdGNoZXIocm91dGVSZWdleCl7Y29uc3R7cmUsZ3JvdXBzfT1yb3V0ZVJlZ2V4O3JldHVybiBwYXRobmFtZT0+e2NvbnN0IHJvdXRlTWF0Y2g9cmUuZXhlYyhwYXRobmFtZSk7aWYoIXJvdXRlTWF0Y2gpe3JldHVybiBmYWxzZTt9Y29uc3QgZGVjb2RlPXBhcmFtPT57dHJ5e3JldHVybiBkZWNvZGVVUklDb21wb25lbnQocGFyYW0pO31jYXRjaChfKXtjb25zdCBlcnI9bmV3IEVycm9yKCdmYWlsZWQgdG8gZGVjb2RlIHBhcmFtJyk7ZXJyLmNvZGU9J0RFQ09ERV9GQUlMRUQnO3Rocm93IGVycjt9fTtjb25zdCBwYXJhbXM9e307T2JqZWN0LmtleXMoZ3JvdXBzKS5mb3JFYWNoKHNsdWdOYW1lPT57Y29uc3QgZz1ncm91cHNbc2x1Z05hbWVdO2NvbnN0IG09cm91dGVNYXRjaFtnLnBvc107aWYobSE9PXVuZGVmaW5lZCl7cGFyYW1zW3NsdWdOYW1lXT1+bS5pbmRleE9mKCcvJyk/bS5zcGxpdCgnLycpLm1hcChlbnRyeT0+ZGVjb2RlKGVudHJ5KSk6Zy5yZXBlYXQ/W2RlY29kZShtKV06ZGVjb2RlKG0pO319KTtyZXR1cm4gcGFyYW1zO307fVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cm91dGUtbWF0Y2hlci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtleHBvcnRzLl9fZXNNb2R1bGU9dHJ1ZTtleHBvcnRzLmdldFJvdXRlUmVnZXg9Z2V0Um91dGVSZWdleDsvLyB0aGlzIGlzbid0IGltcG9ydGluZyB0aGUgZXNjYXBlLXN0cmluZy1yZWdleCBtb2R1bGVcbi8vIHRvIHJlZHVjZSBieXRlc1xuZnVuY3Rpb24gZXNjYXBlUmVnZXgoc3RyKXtyZXR1cm4gc3RyLnJlcGxhY2UoL1t8XFxcXHt9KClbXFxdXiQrKj8uLV0vZywnXFxcXCQmJyk7fWZ1bmN0aW9uIHBhcnNlUGFyYW1ldGVyKHBhcmFtKXtjb25zdCBvcHRpb25hbD1wYXJhbS5zdGFydHNXaXRoKCdbJykmJnBhcmFtLmVuZHNXaXRoKCddJyk7aWYob3B0aW9uYWwpe3BhcmFtPXBhcmFtLnNsaWNlKDEsLTEpO31jb25zdCByZXBlYXQ9cGFyYW0uc3RhcnRzV2l0aCgnLi4uJyk7aWYocmVwZWF0KXtwYXJhbT1wYXJhbS5zbGljZSgzKTt9cmV0dXJue2tleTpwYXJhbSxyZXBlYXQsb3B0aW9uYWx9O31mdW5jdGlvbiBnZXRSb3V0ZVJlZ2V4KG5vcm1hbGl6ZWRSb3V0ZSl7Y29uc3Qgc2VnbWVudHM9KG5vcm1hbGl6ZWRSb3V0ZS5yZXBsYWNlKC9cXC8kLywnJyl8fCcvJykuc2xpY2UoMSkuc3BsaXQoJy8nKTtjb25zdCBncm91cHM9e307bGV0IGdyb3VwSW5kZXg9MTtjb25zdCBwYXJhbWV0ZXJpemVkUm91dGU9c2VnbWVudHMubWFwKHNlZ21lbnQ9PntpZihzZWdtZW50LnN0YXJ0c1dpdGgoJ1snKSYmc2VnbWVudC5lbmRzV2l0aCgnXScpKXtjb25zdHtrZXksb3B0aW9uYWwscmVwZWF0fT1wYXJzZVBhcmFtZXRlcihzZWdtZW50LnNsaWNlKDEsLTEpKTtncm91cHNba2V5XT17cG9zOmdyb3VwSW5kZXgrKyxyZXBlYXQsb3B0aW9uYWx9O3JldHVybiByZXBlYXQ/b3B0aW9uYWw/Jyg/Oi8oLis/KSk/JzonLyguKz8pJzonLyhbXi9dKz8pJzt9ZWxzZXtyZXR1cm5gLyR7ZXNjYXBlUmVnZXgoc2VnbWVudCl9YDt9fSkuam9pbignJyk7Ly8gZGVhZCBjb2RlIGVsaW1pbmF0ZSBmb3IgYnJvd3NlciBzaW5jZSBpdCdzIG9ubHkgbmVlZGVkXG4vLyB3aGlsZSBnZW5lcmF0aW5nIHJvdXRlcy1tYW5pZmVzdFxuaWYodHlwZW9mIHdpbmRvdz09PSd1bmRlZmluZWQnKXtsZXQgcm91dGVLZXlDaGFyQ29kZT05NztsZXQgcm91dGVLZXlDaGFyTGVuZ3RoPTE7Ly8gYnVpbGRzIGEgbWluaW1hbCByb3V0ZUtleSB1c2luZyBvbmx5IGEteiBhbmQgbWluaW1hbCBudW1iZXIgb2YgY2hhcmFjdGVyc1xuY29uc3QgZ2V0U2FmZVJvdXRlS2V5PSgpPT57bGV0IHJvdXRlS2V5PScnO2ZvcihsZXQgaT0wO2k8cm91dGVLZXlDaGFyTGVuZ3RoO2krKyl7cm91dGVLZXkrPVN0cmluZy5mcm9tQ2hhckNvZGUocm91dGVLZXlDaGFyQ29kZSk7cm91dGVLZXlDaGFyQ29kZSsrO2lmKHJvdXRlS2V5Q2hhckNvZGU+MTIyKXtyb3V0ZUtleUNoYXJMZW5ndGgrKztyb3V0ZUtleUNoYXJDb2RlPTk3O319cmV0dXJuIHJvdXRlS2V5O307Y29uc3Qgcm91dGVLZXlzPXt9O2xldCBuYW1lZFBhcmFtZXRlcml6ZWRSb3V0ZT1zZWdtZW50cy5tYXAoc2VnbWVudD0+e2lmKHNlZ21lbnQuc3RhcnRzV2l0aCgnWycpJiZzZWdtZW50LmVuZHNXaXRoKCddJykpe2NvbnN0e2tleSxvcHRpb25hbCxyZXBlYXR9PXBhcnNlUGFyYW1ldGVyKHNlZ21lbnQuc2xpY2UoMSwtMSkpOy8vIHJlcGxhY2UgYW55IG5vbi13b3JkIGNoYXJhY3RlcnMgc2luY2UgdGhleSBjYW4gYnJlYWtcbi8vIHRoZSBuYW1lZCByZWdleFxubGV0IGNsZWFuZWRLZXk9a2V5LnJlcGxhY2UoL1xcVy9nLCcnKTtsZXQgaW52YWxpZEtleT1mYWxzZTsvLyBjaGVjayBpZiB0aGUga2V5IGlzIHN0aWxsIGludmFsaWQgYW5kIGZhbGxiYWNrIHRvIHVzaW5nIGEga25vd25cbi8vIHNhZmUga2V5XG5pZihjbGVhbmVkS2V5Lmxlbmd0aD09PTB8fGNsZWFuZWRLZXkubGVuZ3RoPjMwKXtpbnZhbGlkS2V5PXRydWU7fWlmKCFpc05hTihwYXJzZUludChjbGVhbmVkS2V5LnN1YnN0cigwLDEpKSkpe2ludmFsaWRLZXk9dHJ1ZTt9aWYoaW52YWxpZEtleSl7Y2xlYW5lZEtleT1nZXRTYWZlUm91dGVLZXkoKTt9cm91dGVLZXlzW2NsZWFuZWRLZXldPWtleTtyZXR1cm4gcmVwZWF0P29wdGlvbmFsP2AoPzovKD88JHtjbGVhbmVkS2V5fT4uKz8pKT9gOmAvKD88JHtjbGVhbmVkS2V5fT4uKz8pYDpgLyg/PCR7Y2xlYW5lZEtleX0+W14vXSs/KWA7fWVsc2V7cmV0dXJuYC8ke2VzY2FwZVJlZ2V4KHNlZ21lbnQpfWA7fX0pLmpvaW4oJycpO3JldHVybntyZTpuZXcgUmVnRXhwKGBeJHtwYXJhbWV0ZXJpemVkUm91dGV9KD86Lyk/JGApLGdyb3Vwcyxyb3V0ZUtleXMsbmFtZWRSZWdleDpgXiR7bmFtZWRQYXJhbWV0ZXJpemVkUm91dGV9KD86Lyk/JGB9O31yZXR1cm57cmU6bmV3IFJlZ0V4cChgXiR7cGFyYW1ldGVyaXplZFJvdXRlfSg/Oi8pPyRgKSxncm91cHN9O31cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJvdXRlLXJlZ2V4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO2V4cG9ydHMuX19lc01vZHVsZT10cnVlO2V4cG9ydHMuZXhlY09uY2U9ZXhlY09uY2U7ZXhwb3J0cy5nZXRMb2NhdGlvbk9yaWdpbj1nZXRMb2NhdGlvbk9yaWdpbjtleHBvcnRzLmdldFVSTD1nZXRVUkw7ZXhwb3J0cy5nZXREaXNwbGF5TmFtZT1nZXREaXNwbGF5TmFtZTtleHBvcnRzLmlzUmVzU2VudD1pc1Jlc1NlbnQ7ZXhwb3J0cy5sb2FkR2V0SW5pdGlhbFByb3BzPWxvYWRHZXRJbml0aWFsUHJvcHM7ZXhwb3J0cy5mb3JtYXRXaXRoVmFsaWRhdGlvbj1mb3JtYXRXaXRoVmFsaWRhdGlvbjtleHBvcnRzLlNUPWV4cG9ydHMuU1A9ZXhwb3J0cy51cmxPYmplY3RLZXlzPXZvaWQgMDt2YXIgX2Zvcm1hdFVybD1yZXF1aXJlKFwiLi9yb3V0ZXIvdXRpbHMvZm9ybWF0LXVybFwiKTsvKipcbiAqIFV0aWxzXG4gKi9mdW5jdGlvbiBleGVjT25jZShmbil7bGV0IHVzZWQ9ZmFsc2U7bGV0IHJlc3VsdDtyZXR1cm4oLi4uYXJncyk9PntpZighdXNlZCl7dXNlZD10cnVlO3Jlc3VsdD1mbiguLi5hcmdzKTt9cmV0dXJuIHJlc3VsdDt9O31mdW5jdGlvbiBnZXRMb2NhdGlvbk9yaWdpbigpe2NvbnN0e3Byb3RvY29sLGhvc3RuYW1lLHBvcnR9PXdpbmRvdy5sb2NhdGlvbjtyZXR1cm5gJHtwcm90b2NvbH0vLyR7aG9zdG5hbWV9JHtwb3J0Pyc6Jytwb3J0OicnfWA7fWZ1bmN0aW9uIGdldFVSTCgpe2NvbnN0e2hyZWZ9PXdpbmRvdy5sb2NhdGlvbjtjb25zdCBvcmlnaW49Z2V0TG9jYXRpb25PcmlnaW4oKTtyZXR1cm4gaHJlZi5zdWJzdHJpbmcob3JpZ2luLmxlbmd0aCk7fWZ1bmN0aW9uIGdldERpc3BsYXlOYW1lKENvbXBvbmVudCl7cmV0dXJuIHR5cGVvZiBDb21wb25lbnQ9PT0nc3RyaW5nJz9Db21wb25lbnQ6Q29tcG9uZW50LmRpc3BsYXlOYW1lfHxDb21wb25lbnQubmFtZXx8J1Vua25vd24nO31mdW5jdGlvbiBpc1Jlc1NlbnQocmVzKXtyZXR1cm4gcmVzLmZpbmlzaGVkfHxyZXMuaGVhZGVyc1NlbnQ7fWFzeW5jIGZ1bmN0aW9uIGxvYWRHZXRJbml0aWFsUHJvcHMoQXBwLGN0eCl7aWYocHJvY2Vzcy5lbnYuTk9ERV9FTlYhPT0ncHJvZHVjdGlvbicpe3ZhciBfQXBwJHByb3RvdHlwZTtpZigoX0FwcCRwcm90b3R5cGU9QXBwLnByb3RvdHlwZSkhPW51bGwmJl9BcHAkcHJvdG90eXBlLmdldEluaXRpYWxQcm9wcyl7Y29uc3QgbWVzc2FnZT1gXCIke2dldERpc3BsYXlOYW1lKEFwcCl9LmdldEluaXRpYWxQcm9wcygpXCIgaXMgZGVmaW5lZCBhcyBhbiBpbnN0YW5jZSBtZXRob2QgLSB2aXNpdCBodHRwczovL25leHRqcy5vcmcvZG9jcy9tZXNzYWdlcy9nZXQtaW5pdGlhbC1wcm9wcy1hcy1hbi1pbnN0YW5jZS1tZXRob2QgZm9yIG1vcmUgaW5mb3JtYXRpb24uYDt0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7fX0vLyB3aGVuIGNhbGxlZCBmcm9tIF9hcHAgYGN0eGAgaXMgbmVzdGVkIGluIGBjdHhgXG5jb25zdCByZXM9Y3R4LnJlc3x8Y3R4LmN0eCYmY3R4LmN0eC5yZXM7aWYoIUFwcC5nZXRJbml0aWFsUHJvcHMpe2lmKGN0eC5jdHgmJmN0eC5Db21wb25lbnQpey8vIEB0cy1pZ25vcmUgcGFnZVByb3BzIGRlZmF1bHRcbnJldHVybntwYWdlUHJvcHM6YXdhaXQgbG9hZEdldEluaXRpYWxQcm9wcyhjdHguQ29tcG9uZW50LGN0eC5jdHgpfTt9cmV0dXJue307fWNvbnN0IHByb3BzPWF3YWl0IEFwcC5nZXRJbml0aWFsUHJvcHMoY3R4KTtpZihyZXMmJmlzUmVzU2VudChyZXMpKXtyZXR1cm4gcHJvcHM7fWlmKCFwcm9wcyl7Y29uc3QgbWVzc2FnZT1gXCIke2dldERpc3BsYXlOYW1lKEFwcCl9LmdldEluaXRpYWxQcm9wcygpXCIgc2hvdWxkIHJlc29sdmUgdG8gYW4gb2JqZWN0LiBCdXQgZm91bmQgXCIke3Byb3BzfVwiIGluc3RlYWQuYDt0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7fWlmKHByb2Nlc3MuZW52Lk5PREVfRU5WIT09J3Byb2R1Y3Rpb24nKXtpZihPYmplY3Qua2V5cyhwcm9wcykubGVuZ3RoPT09MCYmIWN0eC5jdHgpe2NvbnNvbGUud2FybihgJHtnZXREaXNwbGF5TmFtZShBcHApfSByZXR1cm5lZCBhbiBlbXB0eSBvYmplY3QgZnJvbSBcXGBnZXRJbml0aWFsUHJvcHNcXGAuIFRoaXMgZGUtb3B0aW1pemVzIGFuZCBwcmV2ZW50cyBhdXRvbWF0aWMgc3RhdGljIG9wdGltaXphdGlvbi4gaHR0cHM6Ly9uZXh0anMub3JnL2RvY3MvbWVzc2FnZXMvZW1wdHktb2JqZWN0LWdldEluaXRpYWxQcm9wc2ApO319cmV0dXJuIHByb3BzO31jb25zdCB1cmxPYmplY3RLZXlzPVsnYXV0aCcsJ2hhc2gnLCdob3N0JywnaG9zdG5hbWUnLCdocmVmJywncGF0aCcsJ3BhdGhuYW1lJywncG9ydCcsJ3Byb3RvY29sJywncXVlcnknLCdzZWFyY2gnLCdzbGFzaGVzJ107ZXhwb3J0cy51cmxPYmplY3RLZXlzPXVybE9iamVjdEtleXM7ZnVuY3Rpb24gZm9ybWF0V2l0aFZhbGlkYXRpb24odXJsKXtpZihwcm9jZXNzLmVudi5OT0RFX0VOVj09PSdkZXZlbG9wbWVudCcpe2lmKHVybCE9PW51bGwmJnR5cGVvZiB1cmw9PT0nb2JqZWN0Jyl7T2JqZWN0LmtleXModXJsKS5mb3JFYWNoKGtleT0+e2lmKHVybE9iamVjdEtleXMuaW5kZXhPZihrZXkpPT09LTEpe2NvbnNvbGUud2FybihgVW5rbm93biBrZXkgcGFzc2VkIHZpYSB1cmxPYmplY3QgaW50byB1cmwuZm9ybWF0OiAke2tleX1gKTt9fSk7fX1yZXR1cm4oMCxfZm9ybWF0VXJsLmZvcm1hdFVybCkodXJsKTt9Y29uc3QgU1A9dHlwZW9mIHBlcmZvcm1hbmNlIT09J3VuZGVmaW5lZCc7ZXhwb3J0cy5TUD1TUDtjb25zdCBTVD1TUCYmdHlwZW9mIHBlcmZvcm1hbmNlLm1hcms9PT0nZnVuY3Rpb24nJiZ0eXBlb2YgcGVyZm9ybWFuY2UubWVhc3VyZT09PSdmdW5jdGlvbic7ZXhwb3J0cy5TVD1TVDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXV0aWxzLmpzLm1hcCIsImltcG9ydCB7IEFwcFdyYXBwZXIgfSBmcm9tICcuLi9zcmMvQ29udGV4dC9jb250ZXh0JztcbmltcG9ydCAnLi4vc3R5bGVzL2dsb2JhbHMuY3NzJ1xuaW1wb3J0IFJlYWN0ICx7dXNlRWZmZWN0fSBmcm9tICdyZWFjdCdcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgeyBRdWVyeUNsaWVudCwgUXVlcnlDbGllbnRQcm92aWRlciB9IGZyb20gJ3JlYWN0LXF1ZXJ5J1xuXG5pbXBvcnQgSGVhZGVyV3JhcHBlciBmcm9tICcuLi9zcmMvR2xvYmFsL0hlYWRlci9IZWFkZXJXcmFwcGVyL0hlYWRlcldyYXBwZXInO1xuaW1wb3J0IE5hdmlnYXRpb25XcmFwcGVyIGZyb20gJy4uL3NyYy9HbG9iYWwvTmF2aWdhdGlvbi9OYXZpZ2F0aW9uV3JhcHBlci9OYXZpZ2F0aW9uV3JhcHBlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE15QXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfSkge1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgLy8gUmVtb3ZlIHRoZSBzZXJ2ZXItc2lkZSBpbmplY3RlZCBDU1MuXG4gICAgY29uc3QganNzU3R5bGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2pzcy1zZXJ2ZXItc2lkZScpO1xuICAgIGlmIChqc3NTdHlsZXMpIHtcbiAgICAgIGpzc1N0eWxlcy5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKGpzc1N0eWxlcyk7XG4gICAgfVxuICB9LCBbXSk7XG5cbiAgY29uc3QgcXVlcnlDbGllbnQgPSBuZXcgUXVlcnlDbGllbnQoe1xuICAgIGRlZmF1bHRPcHRpb25zOiB7XG4gICAgICBxdWVyaWVzOiB7XG4gICAgICAgIHJlZmV0Y2hPbldpbmRvd0ZvY3VzOiBmYWxzZSxcbiAgICAgICAgcmVmZXRjaE9ubW91bnQ6IGZhbHNlLFxuICAgICAgICByZWZldGNoT25SZWNvbm5lY3Q6IGZhbHNlLFxuICAgICAgICByZXRyeTogZmFsc2UsXG4gICAgICAgXG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xuICByZXR1cm4gKFxuICAgIDxRdWVyeUNsaWVudFByb3ZpZGVyIGNsaWVudD17cXVlcnlDbGllbnR9PlxuICAgICAgPEFwcFdyYXBwZXI+XG4gICAgICAgIDxIZWFkZXJXcmFwcGVyIC8+XG4gICAgICAgIDxOYXZpZ2F0aW9uV3JhcHBlciAvPlxuICAgICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9PjwvQ29tcG9uZW50PlxuICAgICAgPC9BcHBXcmFwcGVyPlxuICAgIDwvUXVlcnlDbGllbnRQcm92aWRlcj5cblxuICApO1xufVxuTXlBcHAucHJvcFR5cGVzID0ge1xuICBDb21wb25lbnQ6IFByb3BUeXBlcy5lbGVtZW50VHlwZS5pc1JlcXVpcmVkLFxuICBwYWdlUHJvcHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbn07IiwiZXhwb3J0IGNvbnN0IEJBU0VfVVJMID0gJ2h0dHBzOi8vaXJhbmNoZW1pLmNvbSc7XHJcbmV4cG9ydCBjb25zdCBCQVNFX1ZJREVPX1VSTCA9ICd4eHh4eCc7XHJcbmV4cG9ydCBjb25zdCBCQVNFX0lNQUdFX1VSTCA9ICd5eXl5eSc7XHJcbmV4cG9ydCBjb25zdCBCQVNFX0ZJTEVfVVJMID0gJ3p6enp6JztcclxuIiwiaW1wb3J0IHsgY3JlYXRlQ29udGV4dCwgdXNlQ29udGV4dCwgdXNlRWZmZWN0LCB1c2VSZWR1Y2VyIH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBCQVNFX1VSTCB9IGZyb20gJy4uL0JBU0VfVVJML2Jhc2VVcmwnO1xyXG5pbXBvcnQgeyBjaXR5SW5pdFN0YXRlLCBjaXR5UmVkdWNlciB9IGZyb20gJy4vcmVkdWNlci9jaXR5UmVkdWNlcic7XHJcbmltcG9ydCB7IHVzZXJSZWR1Y2VyLCB1c2VySW5pdFN0YXRlIH0gZnJvbSAnLi9yZWR1Y2VyL3VzZXJSZWR1Y2VyJztcclxuXHJcbmNvbnN0IEFwcENvbnRleHQgPSBjcmVhdGVDb250ZXh0KCk7XHJcblxyXG5jb25zdCBBcHBXcmFwcGVyID0gKHsgY2hpbGRyZW4gfSkgPT4ge1xyXG4gIGNvbnN0IFt1c2VyLCBkaXNwYXRjaF0gPSB1c2VSZWR1Y2VyKHVzZXJSZWR1Y2VyLCB1c2VySW5pdFN0YXRlKTtcclxuICBjb25zdCBbY2l0aWVzLCBzZXRDaXRpZXNdID0gdXNlUmVkdWNlcihjaXR5UmVkdWNlciwgY2l0eUluaXRTdGF0ZSk7XHJcblxyXG4gIHVzZUVmZmVjdChhc3luYyAoKSA9PiB7XHJcbiAgICBsZXQgY29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcclxuXHJcbiAgICBhc3luYyBmdW5jdGlvbiBnZXRVc2VyRGF0YSgpIHtcclxuICAgICAgY29uc3QgdXNlckRhdGEgPSBhd2FpdCBmZXRjaChgJHtCQVNFX1VSTH0vYXBpL3VzZXIvaW5mb2AsIHtcclxuICAgICAgICBjcmVkZW50aWFsczogJ2luY2x1ZGUnLFxyXG4gICAgICAgIHNpZ25hbDogY29udHJvbGxlci5zaWduYWwsXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaWYgKHVzZXJEYXRhLnN0YXR1cyA9PSAyMDApIHtcclxuICAgICAgICBjb25zdCB7IHVzZXIsIHJvbGUsIG1vbmdvSWQgfSA9IGF3YWl0IHVzZXJEYXRhLmpzb24oKTtcclxuXHJcbiAgICAgICAgZGlzcGF0Y2goe1xyXG4gICAgICAgICAgdHlwZTogJ2NoYW5nZScsXHJcbiAgICAgICAgICBwYXlsb2FkOiB7XHJcbiAgICAgICAgICAgIC4uLnVzZXIsXHJcbiAgICAgICAgICAgIHJvbGU6IHJvbGUucm9sZSxcclxuICAgICAgICAgICAgcm9sZVR5cGU6IHJvbGUucm9sZVR5cGUsXHJcbiAgICAgICAgICAgIG1vbmdvSWQsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VXNlckRhdGEoKTtcclxuXHJcbiAgICByZXR1cm4gKCkgPT4gY29udHJvbGxlci5hYm9ydCgpO1xyXG4gIH0sIFtdKTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxBcHBDb250ZXh0LlByb3ZpZGVyXHJcbiAgICAgIHZhbHVlPXt7IHVzZXIsIGNoYW5nZXI6IGRpc3BhdGNoLCBjaXRpZXMsIGRpc3BhdGNoQ2l0eTogc2V0Q2l0aWVzIH19XHJcbiAgICA+XHJcbiAgICAgIHtjaGlsZHJlbn1cclxuICAgIDwvQXBwQ29udGV4dC5Qcm92aWRlcj5cclxuICApO1xyXG59O1xyXG5cclxuY29uc3QgVXNlQXBwQ29udGV4dCA9ICgpID0+IHtcclxuICByZXR1cm4gdXNlQ29udGV4dChBcHBDb250ZXh0KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIEFwcFdyYXBwZXIsXHJcbiAgVXNlQXBwQ29udGV4dCxcclxufTtcclxuIiwiY29uc3QgY2l0eUluaXRTdGF0ZSA9IFtdO1xyXG5cclxuY29uc3QgY2l0eVJlZHVjZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xyXG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgIGNhc2UgJ2FkZENpdHknOiB7XHJcbiAgICAgIGxldCBuZXdTdGF0ZSA9IHN0YXRlLmNvbmNhdCh7XHJcbiAgICAgICAgY2l0eTogYWN0aW9uLnBheWxvYWQuY2l0eSxcclxuICAgICAgICBpZDogYWN0aW9uLnBheWxvYWQuaWQsXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgcmV0dXJuIG5ld1N0YXRlO1xyXG4gICAgfVxyXG4gICAgY2FzZSAncmVtb3ZlQ2l0eSc6IHtcclxuICAgICAgbGV0IG5ld1N0YXRlID0gc3RhdGUuZmlsdGVyKChpdG0pID0+IHtcclxuICAgICAgICByZXR1cm4gaXRtLmlkICE9PSBhY3Rpb24ucGF5bG9hZC5pZDtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICByZXR1cm4gbmV3U3RhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0geyBjaXR5UmVkdWNlciwgY2l0eUluaXRTdGF0ZSB9O1xyXG4iLCJjb25zdCB1c2VySW5pdFN0YXRlID0ge1xyXG4gIHVzZXJuYW1lOiAnJyxcclxuICBhdmF0YXI6ICcnLFxyXG4gIHJvbGU6ICcnLFxyXG4gIHJvbGVUeXBlOiAnJyxcclxuICB1c2VyVHlwZTogJycsXHJcbiAgaXNSZXN0cmljdGVkOiAnJyxcclxuICBlbWFpbFZlcmlmaWVkOiAnJyxcclxuICBtb2JpbGVWZXJpZmllZDogJycsXHJcbiAgaWQ6ICcnLFxyXG4gIG1vYmlsZTogJycsXHJcbiAgZW1haWw6ICcnLFxyXG4gIG1vbmdvSWQ6ICcnLFxyXG59O1xyXG5cclxuY29uc3QgdXNlclJlZHVjZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xyXG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgIGNhc2UgJ2NoYW5nZSc6XHJcbiAgICAgIHJldHVybiB7IC4uLmFjdGlvbi5wYXlsb2FkIH07XHJcblxyXG4gICAgY2FzZSAnc2lnbic6XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uc3RhdGUsXHJcbiAgICAgICAgdXNlcm5hbWU6IGFjdGlvbi5wYXlsb2FkLnVzZXJuYW1lLFxyXG4gICAgICAgIGVtYWlsOiBhY3Rpb24ucGF5bG9hZC5lbWFpbCxcclxuICAgICAgICBtb2JpbGU6IGFjdGlvbi5wYXlsb2FkLm1vYmlsZSxcclxuICAgICAgfTtcclxuXHJcbiAgICBjYXNlICd2ZXJpZnknOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnN0YXRlLFxyXG4gICAgICAgIGVtYWlsVmVyaWZpZWQ6IGFjdGlvbi5wYXlsb2FkLmVtYWlsVmVyaWZpZWQsXHJcbiAgICAgICAgbW9iaWxlVmVyaWZpZWQ6IGFjdGlvbi5wYXlsb2FkLm1vYmlsZVZlcmlmaWVkLFxyXG4gICAgICB9O1xyXG5cclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBzdGF0ZTtcclxuICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHsgdXNlclJlZHVjZXIsIHVzZXJJbml0U3RhdGUgfTtcclxuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHN0eWxlcyBmcm9tICcuL0J1cmdlck1lbnUubW9kdWxlLmNzcyc7XHJcblxyXG5jb25zdCBCdXJnZXJNZW51ID0gKHtcclxuICBzZXREcm9wRG93bk1lbnVIZWlnaHQsXHJcbiAgc2V0RHJvcE1lbnVDb250ZW50LFxyXG4gIGJ1cmdlclN0eWxlLFxyXG4gIHNldEJ1cmdlclN0eWxlLFxyXG59KSA9PiB7XHJcbiAgY29uc3QgY2hhbmdlQnVyZ2VyTWVudVN0eWxlID0gKGUpID0+IHtcclxuICAgIGlmIChidXJnZXJTdHlsZSA9PT0gJ29wZW5lZCcpIHtcclxuICAgICAgc2V0RHJvcERvd25NZW51SGVpZ2h0KCcnKTtcclxuICAgICAgc2V0QnVyZ2VyU3R5bGUoJycpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc2V0RHJvcE1lbnVDb250ZW50KCdtZW51Jyk7XHJcbiAgICAgIHNldEJ1cmdlclN0eWxlKCdvcGVuZWQnKTtcclxuICAgICAgc2V0RHJvcERvd25NZW51SGVpZ2h0KCdkcm9wcGVkTWVudUhlaWdodCcpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC0xIGQtZmxleCBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyXCI+XHJcbiAgICAgIDxidXR0b25cclxuICAgICAgICBjbGFzc05hbWU9e2Ake3N0eWxlcy5tZW51fSAke3N0eWxlc1tidXJnZXJTdHlsZV19YH1cclxuICAgICAgICBvbkNsaWNrPXtjaGFuZ2VCdXJnZXJNZW51U3R5bGV9XHJcbiAgICAgID5cclxuICAgICAgICA8c3ZnIHdpZHRoPVwiNDBcIiBoZWlnaHQ9XCIzNlwiIHZpZXdCb3g9XCIwIDAgMTAwIDEwMFwiPlxyXG4gICAgICAgICAgPHBhdGhcclxuICAgICAgICAgICAgY2xhc3NOYW1lPXtgJHtzdHlsZXMubGluZX0gJHtzdHlsZXMubGluZTF9YH1cclxuICAgICAgICAgICAgZD1cIk0gMjAsMjkuMDAwMDQ2IEggODAuMDAwMjMxIEMgODAuMDAwMjMxLDI5LjAwMDA0NiA5NC40OTg4MzksMjguODE3MzUyIDk0LjUzMjk4Nyw2Ni43MTEzMzEgOTQuNTQzMTQyLDc3Ljk4MDY3MyA5MC45NjYwODEsODEuNjcwMjQ2IDg1LjI1OTE3Myw4MS42Njg5OTcgNzkuNTUyMjYxLDgxLjY2Nzc1MSA3NS4wMDAyMTEsNzQuOTk5OTQyIDc1LjAwMDIxMSw3NC45OTk5NDIgTCAyNS4wMDAwMjEsMjUuMDAwMDU4XCJcclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8cGF0aCBjbGFzc05hbWU9e2Ake3N0eWxlcy5saW5lfSAke3N0eWxlcy5saW5lMn1gfSBkPVwiTSAyMCw1MCBIIDgwXCIgLz5cclxuICAgICAgICAgIDxwYXRoXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT17YCR7c3R5bGVzLmxpbmV9ICR7c3R5bGVzLmxpbmUzfWB9XHJcbiAgICAgICAgICAgIGQ9XCJNIDIwLDcwLjk5OTk1NCBIIDgwLjAwMDIzMSBDIDgwLjAwMDIzMSw3MC45OTk5NTQgOTQuNDk4ODM5LDcxLjE4MjY0OCA5NC41MzI5ODcsMzMuMjg4NjY5IDk0LjU0MzE0MiwyMi4wMTkzMjcgOTAuOTY2MDgxLDE4LjMyOTc1NCA4NS4yNTkxNzMsMTguMzMxMDAzIDc5LjU1MjI2MSwxOC4zMzIyNDkgNzUuMDAwMjExLDI1LjAwMDA1OCA3NS4wMDAyMTEsMjUuMDAwMDU4IEwgMjUuMDAwMDIxLDc0Ljk5OTk0MlwiXHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvc3ZnPlxyXG4gICAgICA8L2J1dHRvbj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBSZWFjdC5tZW1vKEJ1cmdlck1lbnUpO1xyXG4iLCJpbXBvcnQgc3R5bGVzIGZyb20gJy4vRkFRLm1vZHVsZS5jc3MnO1xyXG5cclxuY29uc3QgRkFRSWNvbiA9ICgpID0+IHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtMSBkLWZsZXgganVzdGlmeS1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9e2Ake3N0eWxlcy5RYnRufWB9PlxyXG4gICAgICAgIDxpIGNsYXNzTmFtZT1cImZhcyBmYS1xdWVzdGlvblwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cclxuICAgICAgPC9idXR0b24+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRkFRSWNvbjtcclxuIiwiaW1wb3J0IFNpZ25VcFNpZ25JbkJ1dHRvbiBmcm9tICcuLi8uLi8uLi9TaWduVXBTaWduSW4vU2lnblVwU2lnbkluQnV0dG9uL1NpZ25VcFNpZ25JbkJ1dHRvbic7XHJcbmltcG9ydCBIZWFkZXJJY29ucyBmcm9tICcuLi9JY29ucy9JY29ucyc7XHJcbmltcG9ydCBMb2dvIGZyb20gJy4uL0xvZ28vTG9nbyc7XHJcbmltcG9ydCBPdmVyTGF5IGZyb20gJy4uL092ZXJsYXkvT3ZlcmxheSc7XHJcbmltcG9ydCBQYWdlTGlua3MgZnJvbSAnLi4vUGFnZUxpbmtzL1BhZ2VMaW5rcyc7XHJcbmltcG9ydCBTZWFyY2hCYXIgZnJvbSAnLi4vU2VhcmNoQmFyL1NlYXJjaEJhcic7XHJcbmltcG9ydCBVc2VyIGZyb20gJy4uL1VzZXIvVXNlcic7XHJcbmltcG9ydCBsb2dvIGZyb20gJy4uLy4uLy4uLy4uL3B1YmxpYy9sb2dvLnBuZyc7XHJcbmltcG9ydCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBNeVdyYXBwZXIgZnJvbSAnLi4vTXkvTXlXcmFwcGVyL015V3JhcHBlcic7XHJcbmltcG9ydCBTZWFyY2hCYXJSZXN1bHQgZnJvbSAnLi4vc2VhcmNoQmFyUmVzdWx0L1NlYXJjaEJhclJlc3VsdCc7XHJcblxyXG5jb25zdCBIZWFkZXJEZXNrdG9wVmlldyA9ICh7XHJcbiAgc2VhcmNoQmFyQW5kTGlua3NXcmFwcGVyLFxyXG4gIHVzZXIsXHJcbiAgc2V0VXNlclNlYXJjaCxcclxuICB1c2VyU2VhcmNoLFxyXG59KSA9PiB7XHJcbiAgY29uc3QgW3Nob3dTdHlsZSwgc2V0U2hvd1N0eWxlXSA9IHVzZVN0YXRlKCcnKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGZ1bmN0aW9uIHJlbW92ZU92ZXJsYXkoZSkge1xyXG4gICAgICBsZXQgdGFyZ2V0ID0gZS50YXJnZXQuY2xvc2VzdCgnI3NlYXJjaEJhck92ZXJMYXknKTtcclxuICAgICAgaWYgKCF0YXJnZXQpIHtcclxuICAgICAgICBzZXRTaG93U3R5bGUoJycpO1xyXG4gICAgICAgIHNldFVzZXJTZWFyY2goW10pO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc2hvd1N0eWxlICE9PSAnJykge1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHJlbW92ZU92ZXJsYXkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAoKSA9PiBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHJlbW92ZU92ZXJsYXkpO1xyXG4gIH0sIFtzaG93U3R5bGVdKTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyLWZsdWlkIGp1c3RpZnktY29udGVudC1hcm91bmQgZC1ub25lIGQtbGctZmxleFwiPlxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC0yXCI+XHJcbiAgICAgICAgPExvZ28gd2lkdGg9ezc3fSBoZWlnaHQ9ezk3fSBsb2dvPXtsb2dvfSAvPlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9e2Bjb2wtNCAke3NlYXJjaEJhckFuZExpbmtzV3JhcHBlcn1gfT5cclxuICAgICAgICA8U2VhcmNoQmFyXHJcbiAgICAgICAgICBzZXRTaG93U3R5bGU9e3NldFNob3dTdHlsZX1cclxuICAgICAgICAgIGRlc2t0b3A9e3RydWV9XHJcbiAgICAgICAgICBzZXRVc2VyU2VhcmNoPXtzZXRVc2VyU2VhcmNofVxyXG4gICAgICAgIC8+XHJcbiAgICAgICAgPFBhZ2VMaW5rc1xyXG4gICAgICAgICAgY2xzPVwibmF2YmFyLW5hdiByb3cgcm93LWNvbHMtMyBkLWZsZXhcIlxyXG4gICAgICAgICAgbmF2TGlDbGFzcz1cImhlYWRlckxpbmtcIlxyXG4gICAgICAgIC8+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8SGVhZGVySWNvbnMgaWNvblN0eWxlPVwiaGVhZGVySWNvbnNXcmFwcGVyXCIgLz5cclxuICAgICAgPE15V3JhcHBlciBteVN0eWxlPVwiY29sLW1kLTMgZC1mbGV4IGZsZXgtY29sdW1uIGFsaWduLWl0ZW1zLWVuZFwiIC8+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLTFcIj5cclxuICAgICAgICB7dXNlcj8udXNlcm5hbWUgJiYgKHVzZXI/LmVtYWlsVmVyaWZpZWQgfHwgdXNlcj8ubW9iaWxlVmVyaWZpZWQpID8gKFxyXG4gICAgICAgICAgPFVzZXIgdXNlckluZm9DbGFzcz1cInVzZXJJbmZvSGVhZGVyXCIgdXNlcj17dXNlcn0gLz5cclxuICAgICAgICApIDogKFxyXG4gICAgICAgICAgPFNpZ25VcFNpZ25JbkJ1dHRvbiBkZXNrdG9wU2l6ZT17dHJ1ZX0gLz5cclxuICAgICAgICApfVxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPE92ZXJMYXkgc2hvd1N0eWxlPXtzaG93U3R5bGV9IG92ZXJMYXlTdHlsZT1cInNlYXJjaEJhck92ZXJMYXlSZXN1bHRzXCI+XHJcbiAgICAgICAgPFNlYXJjaEJhclJlc3VsdFxyXG4gICAgICAgICAgc2VhcmNoQmFyQ2xhc3M9XCJsaXN0LWdyb3VwIGxpc3QtZ3JvdXAtZmx1c2ggdy01MFwiXHJcbiAgICAgICAgICB1c2VyU2VhcmNoPXt1c2VyU2VhcmNofVxyXG4gICAgICAgIC8+XHJcbiAgICAgIDwvT3ZlckxheT5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBIZWFkZXJEZXNrdG9wVmlldztcclxuIiwiaW1wb3J0IG1vYmlsZWxvZ28gZnJvbSAnLi4vLi4vLi4vLi4vcHVibGljL21vYmlsZWxvZ28ucG5nJztcclxuaW1wb3J0IExvZ28gZnJvbSAnLi4vTG9nby9Mb2dvJztcclxuaW1wb3J0IFNpZ25VcFNpZ25JbkJ1dHRvbiBmcm9tICcuLi8uLi8uLi9TaWduVXBTaWduSW4vU2lnblVwU2lnbkluQnV0dG9uL1NpZ25VcFNpZ25JbkJ1dHRvbic7XHJcbmltcG9ydCBVc2VyIGZyb20gJy4uL1VzZXIvVXNlcic7XHJcbmltcG9ydCBTdWJIZWFkZXIgZnJvbSAnLi9TdWJIZWFkZXIvU3ViSGVhZGVyJztcclxuXHJcbmNvbnN0IEhlYWRlck1vYmlsZSA9ICh7IHVzZXIsIHNldFVzZXJTZWFyY2gsIHVzZXJTZWFyY2ggfSkgPT4ge1xyXG4gIHJldHVybiAoXHJcbiAgICA8PlxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImQtbGctbm9uZSBkLWZsZXggY29udGFpbmVyLWZsdWlkIGp1c3RpZnktY29udGVudC1hcm91bmQgcG9zaXRpb24tcmVsYXRpdmVcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC02XCI+XHJcbiAgICAgICAgICA8TG9nbyB3aWR0aD17NTR9IGhlaWdodD17NTZ9IGxvZ289e21vYmlsZWxvZ299IC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtNiBkLWZsZXggZmxleC13cmFwIGp1c3RpZnktY29udGVudC1lbmRcIj5cclxuICAgICAgICAgIHt1c2VyPy51c2VybmFtZSAmJiAodXNlcj8uZW1haWxWZXJpZmllZCB8fCB1c2VyPy5tb2JpbGVWZXJpZmllZCkgPyAoXHJcbiAgICAgICAgICAgIDxVc2VyIHVzZXJJbmZvQ2xhc3M9XCJ1c2VySW5mb0hlYWRlck1vYmlsZVwiIHVzZXI9e3VzZXJ9IC8+XHJcbiAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICA8U2lnblVwU2lnbkluQnV0dG9uIC8+XHJcbiAgICAgICAgICApfVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPFN1YkhlYWRlciBzZXRVc2VyU2VhcmNoPXtzZXRVc2VyU2VhcmNofSB1c2VyU2VhcmNoPXt1c2VyU2VhcmNofSAvPlxyXG4gICAgPC8+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEhlYWRlck1vYmlsZTtcclxuIiwiaW1wb3J0IEJ1cmdlck1lbnUgZnJvbSAnLi4vLi4vQnVyZ2VyTWVudS9CdXJnZXJNZW51JztcclxuaW1wb3J0IFBhZ2VMaW5rcyBmcm9tICcuLi8uLi9QYWdlTGlua3MvUGFnZUxpbmtzJztcclxuaW1wb3J0IFNlYXJjaEJhciBmcm9tICcuLi8uLi9TZWFyY2hCYXIvU2VhcmNoQmFyJztcclxuaW1wb3J0IHN0eWxlcyBmcm9tICcuL1N1YkhlYWRlci5tb2R1bGUuY3NzJztcclxuaW1wb3J0IE15V3JhcHBlciBmcm9tICcuLi8uLi9NeS9NeVdyYXBwZXIvTXlXcmFwcGVyJztcclxuaW1wb3J0IEhlYWRlckljb25zIGZyb20gJy4uLy4uL0ljb25zL0ljb25zJztcclxuaW1wb3J0IHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBTZWFyY2hCYXJSZXN1bHQgZnJvbSAnLi4vLi4vc2VhcmNoQmFyUmVzdWx0L1NlYXJjaEJhclJlc3VsdCc7XHJcbmltcG9ydCBPdmVyTGF5IGZyb20gJy4uLy4uL092ZXJsYXkvT3ZlcmxheSc7XHJcbmltcG9ydCBGQVFJY29uIGZyb20gJy4uLy4uL0ZBUUljb24vRkFRSWNvbic7XHJcbmNvbnN0IFN1YkhlYWRlciA9ICh7IHVzZXJTZWFyY2gsIHNldFVzZXJTZWFyY2ggfSkgPT4ge1xyXG4gIGNvbnN0IFtkcm9wRG93bk1lbnVIZWlnaHQsIHNldERyb3BEb3duTWVudUhlaWdodF0gPSB1c2VTdGF0ZSgnJyk7XHJcbiAgY29uc3QgW2Ryb3BNZW51Q29udGVudCwgc2V0RHJvcE1lbnVDb250ZW50XSA9IHVzZVN0YXRlKCdzZWFyY2gnKTtcclxuICBjb25zdCBbYnVyZ2VyU3R5bGUsIHNldEJ1cmdlclN0eWxlXSA9IHVzZVN0YXRlKCcnKTtcclxuXHJcbiAgbGV0IERyb3BNZW51Q29udGVudCA9XHJcbiAgICBkcm9wTWVudUNvbnRlbnQgPT09ICdtZW51JyA/IChcclxuICAgICAgPD5cclxuICAgICAgICA8UGFnZUxpbmtzIGNscz1cIm5hdiBmbGV4LWNvbHVtbiBteS0xXCIgbmF2TGlDbGFzcz1cInNtYWxsSGVhZGVyTGlua1wiIC8+XHJcbiAgICAgICAgPE15V3JhcHBlciBteVN0eWxlPVwibXktMlwiIC8+XHJcbiAgICAgICAgPEhlYWRlckljb25zIGljb25TdHlsZT1cImhlYWRlckljb25XcmFwcGVyTW9iaWxlXCIgLz5cclxuICAgICAgPC8+XHJcbiAgICApIDogZHJvcE1lbnVDb250ZW50ID09PSAnc2VhcmNoJyA/IChcclxuICAgICAgPFNlYXJjaEJhclJlc3VsdFxyXG4gICAgICAgIHNlYXJjaEJhckNsYXNzPVwibGlzdC1ncm91cCBsaXN0LWdyb3VwLWZsdXNoXCJcclxuICAgICAgICB1c2VyU2VhcmNoPXt1c2VyU2VhcmNofVxyXG4gICAgICAvPlxyXG4gICAgKSA6IChcclxuICAgICAgPGRpdj5sb2NhdGlvbm5uPC9kaXY+XHJcbiAgICApO1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgICBjbGFzc05hbWU9e2BkLWxnLW5vbmUgZC1mbGV4IGNvbnRhaW5lci1mbHVpZCBqdXN0aWZ5LWNvbnRlbnQtYXJvdW5kIG10LTEgJHtzdHlsZXMuc3ViSGVhZGVyfWB9XHJcbiAgICA+XHJcbiAgICAgIDxCdXJnZXJNZW51XHJcbiAgICAgICAgc2V0RHJvcERvd25NZW51SGVpZ2h0PXtzZXREcm9wRG93bk1lbnVIZWlnaHR9XHJcbiAgICAgICAgc2V0RHJvcE1lbnVDb250ZW50PXtzZXREcm9wTWVudUNvbnRlbnR9XHJcbiAgICAgICAgYnVyZ2VyU3R5bGU9e2J1cmdlclN0eWxlfVxyXG4gICAgICAgIHNldEJ1cmdlclN0eWxlPXtzZXRCdXJnZXJTdHlsZX1cclxuICAgICAgLz5cclxuICAgICAgPGRpdlxyXG4gICAgICAgIGNsYXNzTmFtZT17YGNvbC04IGQtZmxleCBmbGV4LXNocmluay0xIGp1c3RpZnktY29udGVudC1iZXR3ZWVuIHB4LTMgYm9yZGVyLXN0YXJ0IGJvcmRlci1lbmQgJHtzdHlsZXMubWlkU3ViSGVhZGVyfWB9XHJcbiAgICAgID5cclxuICAgICAgICA8U2VhcmNoQmFyXHJcbiAgICAgICAgICBzZXRTaG93U3R5bGU9e3NldERyb3BEb3duTWVudUhlaWdodH1cclxuICAgICAgICAgIHNldERyb3BNZW51Q29udGVudD17c2V0RHJvcE1lbnVDb250ZW50fVxyXG4gICAgICAgICAgc2V0QnVyZ2VyU3R5bGU9e3NldEJ1cmdlclN0eWxlfVxyXG4gICAgICAgICAgc2V0VXNlclNlYXJjaD17c2V0VXNlclNlYXJjaH1cclxuICAgICAgICAvPlxyXG4gICAgICAgIDxPdmVyTGF5IHNob3dTdHlsZT17ZHJvcERvd25NZW51SGVpZ2h0fSBvdmVyTGF5U3R5bGU9XCJkcm9wcGVkTWVudVwiPlxyXG4gICAgICAgICAge0Ryb3BNZW51Q29udGVudH1cclxuICAgICAgICA8L092ZXJMYXk+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8RkFRSWNvbiAvPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFN1YkhlYWRlcjtcclxuIiwiaW1wb3J0IHN0eWxlcyBmcm9tICcuL0hlYWRlcldyYXBwZXIubW9kdWxlLmNzcyc7XHJcbmltcG9ydCB7IFVzZUFwcENvbnRleHQgfSBmcm9tICcuLi8uLi8uLi9Db250ZXh0L2NvbnRleHQnO1xyXG5pbXBvcnQgSGVhZGVyRGVza3RvcFZpZXcgZnJvbSAnLi4vSGVhZGVyRGVza3RvcFZpZXcvSGVhZGVyRGVza3RvcFZpZXcnO1xyXG5pbXBvcnQgSGVhZGVyTW9iaWxlIGZyb20gJy4uL0hlYWRlck1vYmlsZS9IZWFkZXJNb2JpbGUnO1xyXG5pbXBvcnQgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcclxuXHJcbmNvbnN0IEhlYWRlcldyYXBwZXIgPSAoKSA9PiB7XHJcbiAgY29uc3QgeyB1c2VyIH0gPSBVc2VBcHBDb250ZXh0KCk7XHJcblxyXG4gIGNvbnN0IFt1c2VyU2VhcmNoLCBzZXRVc2VyU2VhcmNoXSA9IHVzZVN0YXRlKHt9KTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDw+XHJcbiAgICAgIDxuYXZcclxuICAgICAgICBjbGFzc05hbWU9e2BuYXZiYXIgbmF2YmFyLWV4cGFuZC1sZyBuYXZiYXItd2hpdGUgYmctd2hpdGUgcHgtNCBtYi0yICR7c3R5bGVzLm5hdkJhcn1gfVxyXG4gICAgICA+XHJcbiAgICAgICAgPEhlYWRlckRlc2t0b3BWaWV3XHJcbiAgICAgICAgICBzZWFyY2hCYXJBbmRMaW5rc1dyYXBwZXI9e3N0eWxlcy5zZWFyY2hCYXJBbmRMaW5rc1dyYXBwZXJ9XHJcbiAgICAgICAgICB1c2VyPXt1c2VyfVxyXG4gICAgICAgICAgdXNlclNlYXJjaD17dXNlclNlYXJjaH1cclxuICAgICAgICAgIHNldFVzZXJTZWFyY2g9e3NldFVzZXJTZWFyY2h9XHJcbiAgICAgICAgLz5cclxuICAgICAgICA8SGVhZGVyTW9iaWxlXHJcbiAgICAgICAgICB1c2VyPXt1c2VyfVxyXG4gICAgICAgICAgdXNlclNlYXJjaD17dXNlclNlYXJjaH1cclxuICAgICAgICAgIHNldFVzZXJTZWFyY2g9e3NldFVzZXJTZWFyY2h9XHJcbiAgICAgICAgLz5cclxuICAgICAgPC9uYXY+XHJcbiAgICA8Lz5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgSGVhZGVyV3JhcHBlcjtcclxuIiwiaW1wb3J0IHN0eWxlcyBmcm9tICcuL0ljb25zLm1vZHVsZS5jc3MnO1xyXG5pbXBvcnQgTGluayBmcm9tICduZXh0L2xpbmsnO1xyXG5pbXBvcnQgeyB1c2VRdWVyeSB9IGZyb20gJ3JlYWN0LXF1ZXJ5JztcclxuaW1wb3J0IGdldFJlcXVlc3QgZnJvbSAnLi4vLi4vLi4vVXRpbC9HRVQvZ2V0UmVxdWVzdCc7XHJcblxyXG5jb25zdCBIZWFkZXJJY29ucyA9ICh7IGljb25TdHlsZSB9KSA9PiB7XHJcbiAgY29uc3QgeyBkYXRhOiB1bnJlYWRNc2dDb3VudCB9ID0gdXNlUXVlcnkoXHJcbiAgICAndW5yZWFkTWVzc2FnZUNvdW50JyxcclxuICAgIGdldFJlcXVlc3QoJy9hcGkvdW5yZWFkL21lc3NhZ2UvY291bnQnKVxyXG4gICk7XHJcblxyXG4gIGNvbnN0IHsgZGF0YTogdW5yZWFkTm90aWZpY2F0aW9ucyB9ID0gdXNlUXVlcnkoXHJcbiAgICAndW5yZWFkTm90aWZpY2F0aW9uQ291bnQnLFxyXG4gICAgZ2V0UmVxdWVzdCgnL2FwaS9ub3RpZmljYXRpb25zL2NvdW50JylcclxuICApO1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9e2Ake3N0eWxlc1tpY29uU3R5bGVdfSByb3cgY29sLTEganVzdGlmeS1jb250ZW50LWJldHdlZW5gfT5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtMyB0ZXh0LWNlbnRlclwiPlxyXG4gICAgICAgIDxzcGFuXHJcbiAgICAgICAgICBjbGFzc05hbWU9e2Ake3N0eWxlcy51c2VyQmFkZ2V9IGJhZGdlIGJhZGdlLXBpbGwgYmctc3VjY2VzcyB0ZXh0LXdoaXRlYH1cclxuICAgICAgICA+XHJcbiAgICAgICAgICA8c21hbGw+e3VucmVhZE5vdGlmaWNhdGlvbnMgJiYgdW5yZWFkTm90aWZpY2F0aW9ucy50b3RhbH08L3NtYWxsPlxyXG4gICAgICAgIDwvc3Bhbj5cclxuICAgICAgICA8TGluayBocmVmPVwiI1wiPlxyXG4gICAgICAgICAgPGE+XHJcbiAgICAgICAgICAgIDxpIGNsYXNzTmFtZT17YGZhciBmYS1iZWxsICR7c3R5bGVzLmZ1bGx9YH0gYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxyXG4gICAgICAgICAgPC9hPlxyXG4gICAgICAgIDwvTGluaz5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLTMgdGV4dC1jZW50ZXJcIj5cclxuICAgICAgICA8c3BhblxyXG4gICAgICAgICAgY2xhc3NOYW1lPXtgJHtzdHlsZXMudXNlckJhZGdlfSBiYWRnZSBiYWRnZS1waWxsIGJnLWluZm8gdGV4dC13aGl0ZWB9XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAgPHNtYWxsPnt1bnJlYWRNc2dDb3VudCAmJiB1bnJlYWRNc2dDb3VudC51bnJlYWRNZXNzYWdlc0NvdW50fTwvc21hbGw+XHJcbiAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgIDxMaW5rIGhyZWY9XCIjXCI+XHJcbiAgICAgICAgICA8YT5cclxuICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZmFyIGZhLWNvbW1lbnQtZG90c1wiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cclxuICAgICAgICAgIDwvYT5cclxuICAgICAgICA8L0xpbms+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEhlYWRlckljb25zO1xyXG4iLCJpbXBvcnQgSW1hZ2UgZnJvbSBcIm5leHQvaW1hZ2VcIjtcclxuXHJcbmNvbnN0IExvZ28gPSAoeyBsb2dvLCB3aWR0aCwgaGVpZ2h0IH0pID0+IHtcclxuICByZXR1cm4gKFxyXG4gICAgPGEgY2xhc3NOYW1lPVwibmF2YmFyLWJyYW5kXCIgaHJlZj1cIiNcIj5cclxuICAgICAgPEltYWdlXHJcbiAgICAgICAgc3JjPXtsb2dvfVxyXG4gICAgICAgIGFsdD1cItio24zZhNio2YjYsdivXCJcclxuICAgICAgICBjbGFzc05hbWU9XCJkLWlubGluZS1ibG9jayBhbGlnbi10ZXh0LXRvcFwiXHJcbiAgICAgICAgd2lkdGg9e3dpZHRofVxyXG4gICAgICAgIGhlaWdodD17aGVpZ2h0fVxyXG4gICAgICAvPlxyXG4gICAgPC9hPlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBMb2dvO1xyXG4iLCJpbXBvcnQgaW50VG9TdHJpbmcgZnJvbSAnLi4vLi4vLi4vVXRpbC9DaGFuZ2VEaXNwbGF5Rm9ybWF0L0ludFRvU3RyaW5nJztcclxuaW1wb3J0IHN0eWxlcyBmcm9tICcuL015Lm1vZHVsZS5jc3MnO1xyXG5cclxuY29uc3QgTXkgPSAoeyBjaGlsZHJlbiwgY3JlZGl0LCBlbnRpdHkgfSkgPT4ge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT17YGlucHV0LWdyb3VwIGlucHV0LWdyb3VwLXNtIG1iLTEgdy03NSAke3N0eWxlcy5teX1gfT5cclxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaW5wdXQtZ3JvdXAtdGV4dFwiPntjaGlsZHJlbn08L3NwYW4+XHJcbiAgICAgIDxpbnB1dFxyXG4gICAgICAgIHR5cGU9XCJ0ZXh0XCJcclxuICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2wgYmctd2hpdGUgc2hhZG93LW5vbmUgdGV4dC1jZW50ZXJcIlxyXG4gICAgICAgIHBsYWNlaG9sZGVyPXtpbnRUb1N0cmluZyhlbnRpdHkpfVxyXG4gICAgICAgIHJlYWRPbmx5XHJcbiAgICAgIC8+XHJcbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImlucHV0LWdyb3VwLXRleHQgZC1mbGV4IGp1c3RpZnktY29udGVudC1jZW50ZXJcIj5cclxuICAgICAgICB7Y3JlZGl0fVxyXG4gICAgICA8L3NwYW4+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgTXk7XHJcbiIsImltcG9ydCBNeSBmcm9tICcuLi9NeSc7XHJcblxyXG5jb25zdCBNeVdyYXBwZXIgPSAoeyBteVN0eWxlIH0pID0+IHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9e215U3R5bGV9PlxyXG4gICAgICA8TXkgY3JlZGl0PVwiQklMXCIgZW50aXR5PXsyMzA1MDQ1MDF9PlxyXG4gICAgICAgINin2YXYqtuM2KfYslxyXG4gICAgICA8L015PlxyXG4gICAgICA8TXkgY3JlZGl0PVwiVFwiIGVudGl0eT17NTQwMDIzfT5cclxuICAgICAgICDZhdmI2KzZiNiv24xcclxuICAgICAgPC9NeT5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBNeVdyYXBwZXI7XHJcbiIsImltcG9ydCBzdHlsZXMgZnJvbSAnLi9PdmVybGF5Lm1vZHVsZS5jc3MnO1xyXG5cclxuY29uc3QgT3ZlckxheSA9ICh7IHNob3dTdHlsZSwgY2hpbGRyZW4sIG92ZXJMYXlTdHlsZSB9KSA9PiB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPXtgJHtzdHlsZXNbb3ZlckxheVN0eWxlXX0gJHtzdHlsZXNbc2hvd1N0eWxlXX1gfT5cclxuICAgICAge2NoaWxkcmVufVxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IE92ZXJMYXk7XHJcbiIsImltcG9ydCBMaW5rIGZyb20gXCJuZXh0L2xpbmtcIjtcclxuaW1wb3J0IHN0eWxlcyBmcm9tIFwiLi9IZWFkZXJMaW5rLm1vZHVsZS5jc3NcIjtcclxuaW1wb3J0IEltYWdlIGZyb20gXCJuZXh0L2ltYWdlXCI7XHJcblxyXG5jb25zdCBIZWFkZXJMaW5rID0gKHsgbGlua1RvLCBjb250ZW50LCBpY29uLCBuYXZMaUNsYXNzIH0pID0+IHtcclxuICByZXR1cm4gKFxyXG4gICAgPGxpIGNsYXNzTmFtZT17YG5hdi1pdGVtIGQtZmxleCBmbGV4LXJvdyBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyYH0+XHJcbiAgICAgIDxJbWFnZSBzcmM9e2ljb259IHdpZHRoPXsxOH0gaGVpZ2h0PXsxOH0gLz5cclxuICAgICAgPExpbmsgaHJlZj17YCR7bGlua1RvfWB9PlxyXG4gICAgICAgIDxhIGNsYXNzTmFtZT1cIm5hdi1saW5rXCI+e2NvbnRlbnR9PC9hPlxyXG4gICAgICA8L0xpbms+XHJcbiAgICA8L2xpPlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBIZWFkZXJMaW5rO1xyXG4iLCJpbXBvcnQgSGVhZGVyTGluayBmcm9tICcuL0hlYWRlckxpbmsvSGVhZGVyTGluayc7XHJcbmltcG9ydCBpbmZvIGZyb20gJy4uLy4uLy4uLy4uL3B1YmxpYy9pbmZvLnN2Zyc7XHJcbmltcG9ydCBhZCBmcm9tICcuLi8uLi8uLi8uLi9wdWJsaWMvYWQuc3ZnJztcclxuaW1wb3J0IGJsb2cgZnJvbSAnLi4vLi4vLi4vLi4vcHVibGljL2Jsb2cuc3ZnJztcclxuaW1wb3J0IHN0eWxlcyBmcm9tICcuL0hlYWRlckxpbmsvSGVhZGVyTGluay5tb2R1bGUuY3NzJztcclxuXHJcbmNvbnN0IFBhZ2VMaW5rcyA9ICh7IGNscywgbmF2TGlDbGFzcyB9KSA9PiB7XHJcbiAgcmV0dXJuIChcclxuICAgIDx1bCBjbGFzc05hbWU9e2Ake2Nsc30gJHtzdHlsZXNbbmF2TGlDbGFzc119YH0+XHJcbiAgICAgIDxIZWFkZXJMaW5rIGxpbmtUbz1cIi9DaGF0XCIgY29udGVudD1cItii2q/Zh9uMXCIgaWNvbj17YWR9IC8+XHJcbiAgICAgIDxIZWFkZXJMaW5rIGxpbmtUbz1cIi9cIiBjb250ZW50PVwi2KjYp9mG2qkg2KfYt9mE2KfYudin2KpcIiBpY29uPXtpbmZvfSAvPlxyXG4gICAgICA8SGVhZGVyTGluayBsaW5rVG89XCIjXCIgY29udGVudD1cItio2YTYp9qvXCIgaWNvbj17YmxvZ30gLz5cclxuICAgIDwvdWw+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFBhZ2VMaW5rcztcclxuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgQkFTRV9VUkwgfSBmcm9tICcuLi8uLi8uLi9CQVNFX1VSTC9iYXNlVXJsJztcclxuXHJcbmltcG9ydCBzdHlsZXMgZnJvbSAnLi9TZWFyY2hCYXIubW9kdWxlLmNzcyc7XHJcbmNvbnN0IFNlYXJjaEJhciA9ICh7XHJcbiAgc2V0U2hvd1N0eWxlLFxyXG4gIGRlc2t0b3AsXHJcbiAgc2V0RHJvcE1lbnVDb250ZW50LFxyXG4gIHNldEJ1cmdlclN0eWxlLFxyXG4gIHNldFVzZXJTZWFyY2gsXHJcbn0pID0+IHtcclxuICBsZXQgdGltZXI7XHJcblxyXG4gIGNvbnN0IHNlYXJjaEhhbmRsZXIgPSAoZSkgPT4ge1xyXG4gICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcclxuICAgIGxldCB0ZXh0ID0gZS50YXJnZXQudmFsdWU7XHJcblxyXG4gICAgaWYgKHRleHQgJiYgdGV4dC50cmltKCkpIHtcclxuICAgICAgdGltZXIgPSBzZXRUaW1lb3V0KGFzeW5jICgpID0+IHtcclxuICAgICAgICBjb25zdCBzZWFyY2hSZXMgPSBhd2FpdCBmZXRjaChcclxuICAgICAgICAgIGAke0JBU0VfVVJMfS9hcGkvc2VhcmNoL2FsbD9zZWFyY2g9JHt0ZXh0fWBcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBpZiAoc2VhcmNoUmVzLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICBjb25zdCBzZWFyY2hSZXNKc29uID0gYXdhaXQgc2VhcmNoUmVzLmpzb24oKTtcclxuICAgICAgICAgIHNldFVzZXJTZWFyY2goc2VhcmNoUmVzSnNvbik7XHJcbiAgICAgICAgICBpZiAoZGVza3RvcCkge1xyXG4gICAgICAgICAgICBzZXRTaG93U3R5bGUoJ3Nob3dTdHlsZScpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2V0RHJvcE1lbnVDb250ZW50KCdzZWFyY2gnKTtcclxuICAgICAgICAgICAgc2V0U2hvd1N0eWxlKChwcnZzKSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKHBydnMgPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICBwcnZzID0gJ2Ryb3BwZWRNZW51SGVpZ2h0JztcclxuXHJcbiAgICAgICAgICAgICAgICBzZXRCdXJnZXJTdHlsZSgnb3BlbmVkJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBydnM7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcnZzO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LCAyMDAwKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHNldFVzZXJTZWFyY2goW10pO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIGNsYXNzTmFtZT17YGlucHV0LWdyb3VwIGlucHV0LWdyb3VwLXNtICR7XHJcbiAgICAgICAgZGVza3RvcCA/IHN0eWxlcy5zZWFyY2hCYXIgOiBzdHlsZXMuc21hbGxTZWFyY2hCYXJcclxuICAgICAgfWB9XHJcbiAgICA+XHJcbiAgICAgIDxzcGFuXHJcbiAgICAgICAgY2xhc3NOYW1lPXtgaW5wdXQtZ3JvdXAtdGV4dCBib3JkZXItMCAke1xyXG4gICAgICAgICAgZGVza3RvcCA/IHN0eWxlcy5yb3VuZGVkSWNvbiA6IHN0eWxlcy5zbWFsbFJvdW5kZWRJY29uXHJcbiAgICAgICAgfWB9XHJcbiAgICAgID5cclxuICAgICAgICA8aSBjbGFzc05hbWU9XCJmYSBmYS1zZWFyY2hcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XHJcbiAgICAgIDwvc3Bhbj5cclxuICAgICAgPGlucHV0XHJcbiAgICAgICAgY2xhc3NOYW1lPXtgZm9ybS1jb250cm9sIGJvcmRlci0wICR7c3R5bGVzLnJvdW5kZWRJbnB1dH1gfVxyXG4gICAgICAgIHR5cGU9XCJ0ZXh0XCJcclxuICAgICAgICBwbGFjZWhvbGRlcj1cItis2LPYqtis2Ygg2K/YsSDYqNuM2YTYqNmI2LHYryAuLi5cIlxyXG4gICAgICAgIG9uQ2hhbmdlPXtzZWFyY2hIYW5kbGVyfVxyXG4gICAgICAgIGRlZmF1bHRWYWx1ZT1cIlwiXHJcbiAgICAgIC8+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgUmVhY3QubWVtbyhTZWFyY2hCYXIpO1xyXG4iLCJpbXBvcnQgTGluayBmcm9tICduZXh0L2xpbmsnO1xyXG5pbXBvcnQgc3R5bGVzIGZyb20gJy4vVXNlci5tb2R1bGUuY3NzJztcclxuXHJcbmNvbnN0IFVzZXIgPSAoeyB1c2VySW5mb0NsYXNzLCB1c2VyIH0pID0+IHtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9e2Ake3N0eWxlc1t1c2VySW5mb0NsYXNzXX1gfT5cclxuICAgICAgPGRpdj5cclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgPExpbmsgaHJlZj1cIiNcIj5cclxuICAgICAgICAgICAgPGE+XHJcbiAgICAgICAgICAgICAgPGltZ1xyXG4gICAgICAgICAgICAgICAgc3JjPVwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFPRUFBQURoQ0FNQUFBQUpiU0pJQUFBQWpWQk1WRVVBQUFEdDdlMysvdjcvLy8vdzhQRDcrL3YyOXZiejgvUDQrUGpvNk9qWjJkbmUzdDdXMXRiS3lzcmo0K1BVMU5UT3pzNmlvcUs4dkx3S0NncEFRRUFuSnlkL2YzKzJ0clllSGg2YW1wcHVibTZ0cmEwdUxpNFNFaEorZm41dGJXMVNVbEppWW1LU2twSWJHeHRaV1ZrMk5qWklTRWlIaDRlbXBxWTBORFIyZG5aVFUxTThQRHdrSkNSZVhsNy8rVmQ2QUFBT3dFbEVRVlI0bk8yZENZT2l1QktBZ1lSYkVGR2J4bHZhVnR2Ui92OC83M0dvRU02UWxCcDdYODN1ekU3WFN2aXNRRkpWU1VWQ2hHQzVLRXFMVGlWME9xRXpDSjNXb2pNSW5VYm9WRUtuRXpxRjBHRVNndFJKU0NrSXFaUVZRbGNpSkhRbFFrSkhFbXBFZ3lTaEh1dVMyNi9UWWVKemFvdU9wSmRmUzRncWhNaUlmTlJOOGM2RXZpUTU4UjkvbGhESmUwbmEyNmlMNG4wSjlaTVV5Nm5HaHZxZklOUlFKS1V5K0t1OUZJOHlRR2xyb0w5SWlPVm9lU1c4T0grUUVHUDdRN3JMUVVWL2pCQmpjNzdKQWFXRitSeENrZ0tPc0RBenc3SElzam1JZGt1cEtFNlpVQ2NneExRaFRpV1psNnFHam1YVHRhMmg0d2Z6YUxVaDZSSlpsZWVzSERac25yUkN6YnhUTzdtZVB4OUYwZUh3OGJFNnJiZS91ODErOHIzNEdsZllNdGxVQ1p0bjVhU3VURmp5SmtDc1Z0VEZjTGIvc2Y5c0lHbVNxWWxiK3lXaFUxcDBTQ0tCNlFrcDZiRThuMTE2MGlYeTZiSFBZc2dIajVWUTBXbDBXSGEyVGYyd1haWStwaWNrZFVDRVZEYkVic2lFRjhzNDZFSDRFQnZTRUdMM3hBb29qZWN4WWZGV2hTUTB0OHlBYjJKRDVpNHE5WHdPWDBTSW5Ta0g0WmNqUHFITy9oREdjbkZmUFZwUTlGSWVRT25NNGRVL2dWQkw1cUFPRitFV2kwdVl6RklIanVPdnVBaERZUWtSY3VjVExyWk1QTXp1TDdVU2twNEdTNHpmM3dQd1NYdTdITWZ2NFUyUUVCTHhYU2lZa05Kc2swSW5oMVZYajBYQytKb0cwVjdKb3VTTnRrSEFlc0E2enlCZmtNVVFLUldyTWZaWlVFTHN3RmhRT3FsaXh0cXdCZklNeG1JSkdoSEdRSDFVMmdvYTFjY1dtN05ibFkwcXBnMXhCQVJZMjBzRnNDRzJJRWI2VEE1QzJoRFBvVHFwSkUxY0VkK2xKdDlFbEpSQVFFSnNMUUFKdDdwNGVRdE9iNmtreTdpYmx2TERCTVJMYkFqM0prMWtYc25NdkR4dmdYZWdoT3QyYjZKWDNvTDBHSXBTOWlZSUlYV0dZbnlERXY3SVdDY2JKRDJORmwwSkFzb0RSbmJmM0V1N2ZEMGxiNkgweUZzZ0gyNDBUQ1NOZWRNU1BpVnZnVWJkZDkxTFF0SGlwUWoyVlJwUDNFUWpWQ0ZuTkltc1JJdTFZWTRzVEszTVRNRUlYU2ozL2laYld6QkMrd2VZOEo4bEZxRXlnQjBPSldrLzBNUWlITUlPaDdHTE9CU00wQU1HbE03ZVh5ZjhlUkJoVzk1Q2JkRXBvTjVoSWd1dmJXOUNuN3hGMVdOSXZRYTl3WnZRRTAzeVh3YWhNM3hvd3VsQUplNmx4cHZRRzNWNi9rR2QzUVBPUDVqc0lRakFDYTN5cnBIaXZUemZ4NGNudkxRUlBqK0tvY0FUZmc2RUlrUWErSFA0OXdtLy9uT0VyODVid0JNdVJiTWhWUFkzSnh5S1JnanRXNGhIeUxOTXIwN0dvaEVPWVFQQ1ZjSlh2Mm1NSTdSL0tQbmt6Ync2YndIdVdpUkRQdEVnZTk1Q0o0VDBHTnAwV2tHamdTMHpLY3JHVW9yZUMza3pwR2ZUckRQVVBoNHdhdEJoK3hHQWtyUTNDLzVMUzcrcytJY0VCTE9QWDh4YmZIVGZMWk9jalB4bW54L0ZLQkJDcHl4eUdTbjN1MzFobkFZUElSUDRwSHdPaENCOFZCOU41Q1FDb2YzMVFNTGwvWFpmUjRqbkR3Uk05NUsrbkJCcVFXSzl6UDg4WVNBQTRmR1JnR05QQUVJSGZNNWRrRS84ZWtMWmhmWjlpekpCdDAySUw4eGJBQytHSWlVQ3lGc1loSlM4Q1VLMGVwMzZ1RWxiUEZqY0c5VmFiclJWMSs0Qk4za1Q4dFhUU0xvUXNxR0RVTGxzN1BwKytkeThCZExYRHlPTW1paWVHOFZBRDV2VlRKMjh6WmNTeW85eGdDVnBWblN6WHhtSlFvK2ExampDRU9ybmh3RE9taW1lSFUxRUQ1bTVYZnhpaTYrTmx5THdWVzJKSEZvb25oOFJma0M4ZEdvS1JXZ2N3QWtEd2ZJV0x2U3dINmxDN2V4U2REeUFUYzFzY0tWK0tUTWhTTjVDbHpGbzltbHZ3dTIzMEFncGVSUFV1a1FKbUVMOGRneU9teUYxWlE4NC9SSnV2OVZaTFZrQmxmeFRvNE9ibjZZam9YNXRMTHVYaXRXVS9FWXJIbkQrTWFDOFJhWkRLdFNvR0tVTlA2YW1BZzloUENyQ0JJYzNWbnBOc1ZaQlo0UXFWMG1hdTR5d3FJUnBFV0FBdVRyMlFoSWlpTTNPNjFzSkNnRUpZZHo5QUl0TTZQSWJjV09MVEtnby9CdTh3dHVWeFNSRVE5NEkrSFFvT0NIaUhUQSs3aGNXazFCQnZCc3ZuQWNUTXVRdFNqcU5iK28yeXoxN3FEcFI1THljLzI4R1YzbU1MOS9vYktIbjMrRHJDTnNiRHNKdFlhTU1xMzlZZ29DdkJjMlZGUFlMdHlOYTVZKzhPWmM5RjdVdzNvR1FaKzFDVUx3YmdRazkxaUQveG53UFFsbG1EWjRlcVNsZVRJZ1pGNEw5eU85Q0tET1dId2lOOXlHMFdjcXc3eTBOS1cveExwVmx3MkF4WWlUcnlydThhUXcwN0cvRWI2dTExc2VyOTF1VUNaWCtpWnFQOXJxNlBJVDNNSGJ0dkRTUEgxZlcwNkNyQXRXY2I5RS9vWmpVMVMzRTIrdm5uZ3Bxam9EZlBsY21oRWtPVkhSeTMxRi9oOHNYMVhvMTJLaXJ5MXRRZVJOZG5rYmZVWCtFeXFlU1FQbUhKVUxHSjYrbWltSS93TTlrdVhQMXJFQ21KKzl4ZVF1Q01Pam5ZWnh0NFFnNzZMSGZMK2lXVHJyL1R5Z1dZZDllYXIwZFljOVl4dGgvTjBLNWIyUTRVaXIxUElVbTdGL05kR3hYeDBPUkNSa08wVm5WbkxzcUxLRm1Nc1F4eHNjMzZxVUdVN1R0NGdQdFQyOG5MR3BwOXdHWGRBajFIQ2x1OHVNUkZ5VUlPZllCTit5aXlDYnBURHAxemhvUy9uYUlIZUprZzlRN0xFbzNDcCszNkR2V0YyVmZQRGxSMkx6RmtDZVY3eFZ1Ujl3NGpjOXN3M0dJM29JUXN4Nm1jd25lSmRhR3JWOFd3TDB2ZWtRNDE2c213M3FGN1NBZkg5SWRZMkJueVlJUmV2ZU5adkViY2Q1ek9lMDBsUE5vSWpMaUs0aGlRM1FseFBqNGMxL3JZOFJHOERaOUFNOU84cms3WVRoenFpUENLd25qc2RLUEg3MTlUaGovU0kyb3pUaU5YRndnVEJjQW5nYUNFS1kzaEt4RE1rSXMzWnd3WWZjb0hZeXRqNGtWcFVoTHNuT1gwTUppN094Q2ludXoxbTJqa3BIK09KN3BCQlRqeGlSd1MrdTgwRERUZklkMnp2aXF2RVZzUHp1NjUwTVBCY0pNcTQ4MjdYeWJvNXRmOTdxeU82OWcvejJ5Y1VHWDMrdFRDRkhLaHcrRjhQMzZ1cUFwSDljUU10c09DOXdFVm5WL0dsSUsxVkkySXptekkvcytZSlVvLzFTYXBMZFdqWXAvRFVoUGR6TFFxcDlURE9lanpwQmZtOE9nZEZFdCs0UkwvTytMMEVxdlNsc1pxcXhqemx2RTQ0TjNLTlhlV1RvVlR5TzFLREw5aUh3aXYzNGpQK21BWkszZ2JJeXZIRUs3T2NyUHoxdkVMb3B6cXM2d1IxazNxemxMWHRGazczaVliWDkvdDZmRDNIUE5iQXBFMW51K0VsWlRIdFBRTm9pYmVYUVVJNzVoNzZOdWdkNXYraktvNWt1VnZHOWN6MjI4Nm1vSjY0b1dUU092ZWV5QUpveDd6S0RwUlBqc0hWTkRlTDhtT2R1c0kyeElQUzVXdzN6cSswREM1Q2x6bWtkeXA4bUc5MnRxWFlUWWJyejZ6RGZ4b3dsalFHZmJzaDRvQWlCc3lUeGUxazdOMkFGSUdOdlAzelMzSDhzdXdlRWtuTFczRUNSMnhNVEtHeWpDSkV6WXRjVGlaOEJOMkhVV3lIZ2R4RytxUjlnUTZ3NkY2ejduSmNSKzkxS2N0U01qNG9NUWhGajJxZnoyVmN6RFIwZ1ZMMThORUd3dnhYZ3dvOHZwcHVzTGVRaE51clZHaXdNdU1ISVQ0c3ovb3hLSHo0YllvczJPVDBjNUl5Y2hsdWNiV3I3a0NOSHF2SlNTTUprTjRCNWJHTGNldWpLMkV1cjVrUlY2NVVTTFdLVmptaGRNTHBONG9xL2RUcmlyT3drRDQ4SzVGVnBKcDJ1OW9uUXJOL3RnM2xqeUJ3blJtYmRRdzM3Rk83OGNMQnZFTmN0V3Ezb1ROOUhqNXZybEJDWkhqTG55RmdnTmVpZHpJM3ozOGFuNkpVbm85VjFBdllwOTZOYnh2NVVRR1VIL0ZkdGJsNGV3ZjJtMHN5L2p0dEd4alJCaitsZG9MaGNQc3hQcTdWTzJXcG1Pa25kTDRiTFVoSGpJbG1FWmNSQmFMQXZFcFpQTVpFUGRZVXdoL2VNZ1pEek1aU2F6UElmczV6bllhckhUOUNKazNieTRsM3YzVXV5d0YyTVpxWDNHK0tMT1lONjd1RTAzRk5XTi93MkUyT0lvVUxiV1dBazVhakpzODZBNEZhSExzOWYxWjhCS3lGTTQrM0R2T1RTRW1LOWlaOEJJeUxYOWRPbjNJTVFlMzY3NkxiR0FxRVJJdEVjUVlyNWpzWDVzUkUybzgyNnFsMXNJVzJ6SVdSTHRVT3RwU0FveEVjOG0vaDV2OGVOajhhbzNUK042Z25lTnAzRVZrN05BLzVlcjVCQjNxY3RicU56bDVYYkZhMUo3R2tQZVpyUHFTOTE1QzJSeDF5VmJGT3R5MG5yQWlQdUwzV1M1dWs0ZkgrS0k3YkNKVUdra2hDajBPcWNpQkNrVXRDMWtkaWx0aUh6K09scGJPa0tMSDVBb0gwdEhDUEQwUzljU1U1MkVJS2VrUjcwSlpZZ2FVMGZjVFloMHBrVnBaVG1iZlFsQlNxQ3VLV3lJWUk2TkdlY2xjaWtKUVdxOVRaSUtSVjJFUUNlSzVqVnlLUWlSZ2pESUY3c01PZ21SQ25Rd3p1UmU3Nm1MTU12OUE1V1ZqRHA3S2RLaHlvOEhPaVZoK21PbS9lMDFraXpwNlNCMFlWcEtOdmIySWJTQWlwOU83YXk2WndzaFhGVm51dzhoV0VYdytPRW8yWkNjaUNzd28yRXE0YzJiS0Rhb0VONEV2bm1MSUFVWFU1bnJtR2hQS2VjdEFHdVA3M1Q2dkFYYzRmT0h5bjc4c2djTWQ4N0JaM1lhRlkwSGpPSEtnZjkyRUdJTDhKaTRMRFpFUVlnQlQ0ZzhhKzI1Sit3d2hkWHJaWnBtVEdnSXVXcThsUnExT2dpWmQyWFZTVUJwUThyY1BaVXMvUTVDMElOL2ZsVXFHK0lCNUtGWTh3NUMwT05HTGw1U2I2U2JFTFRSNHpNSnBVaWxJZXhhQmRWUHVtd0llOXJJeEtRZzVObXdXSlV2cDRQUWd6MWZPNkFnWk5razFTeDdvMnVsQW9pSGY1ZC9OWE9hRWlIMkFBZW9kQ0YyT3lIMFlYL0RDcUZTSm9TYkNjY3lrZHNJVVpxM0NFRVJENTI5bERlV1Q4aG5rb0JxczZHQ1pXekNmcWQyaVpDTUR4dkFKN1VlMVRKaGJkNWk5QVBZWm9qYjh4YVE1OUo5SDlPNFFuZmVRckVPY0cvVWM0Y0gzSHNSVktOOHJyenNvdDFyRTVQMGt4WE85akNZQWJGdW9aSzNBQmtxRnZ0MTZKbTN6UXBVcXk4VDg1cmU4YkRsZncyczlSWWJHaWIzOVg5bVllRFl1TERmaEhaOUtVcldpYnEyRnh4MlB4ZU85K3ZVS2E0Nkt4Tnl2TmJHMC9NMjh0MTQvQ2t0dWUrM2dqWkx6ZzduMGVxWGRmM0pvVG1yandkczhabmxaSDBZK2U3dEhRYXl6aHZMdGoxMHdqVkQ4dlJpTmhQMmQ5Ykc1MW5vT3dNOUs1UjRGUlpDUkJCbXV1ejdNdjNqNGJTYjlIZ05SVTJFMktidkY0dkpidll4OHEzcjZtT2k1OFB1N0VveFZkbDJnbU4wK3JlZ2VVQW5oZjBmSkNGVmp1Um50NHJmSmQ3UWxmUFh5Y05yREtGMGgyVTg0ekpkeTVtSEgrdmZ6ZjU3K3RXRWUyd2dORGNOSDFoZUZ1ZjlidjBSQmtOWE53eWw4cXc5OVZ6dUxPcXJ5YmJuQi9OUmVEaXRONU1wNmZIdDhrYUxoQ1VUTHFmbi9lL3M0eENOam9IdldHNWg5YllpUUdYSS9HYU1lSXdaREQzSDhlZGhsRnIzdk1nSERJSnd2dHR0MTZkRGRBeWNnV1c3cGh2L2UvL1NoSzJFbGM0OWljaTlXbmpwbFo3RDBwd1ZxSzV1T1c5QktnbXBlNWZlcE1tR2FhVUJRbWRjZjByRzhUUFI4ZzlWZEt3VldrdDdFLzRIN0loeXAvRnlpYW9BQUFBQVNVVk9SSzVDWUlJPVwiXHJcbiAgICAgICAgICAgICAgICBhbHQ9XCJVc2VyXCJcclxuICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICA8L0xpbms+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8c3Bhbj57dXNlciAmJiB1c2VyLnVzZXJuYW1lfTwvc3Bhbj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBVc2VyO1xyXG4iLCJpbXBvcnQgc3R5bGVzIGZyb20gJy4vUmVzdWx0cy5tb2R1bGUuY3NzJztcclxuaW1wb3J0IExpbmsgZnJvbSAnbmV4dC9saW5rJztcclxuaW1wb3J0IFNlYXJjaFJlc3VsdFN0YXIgZnJvbSAnLi4vU2VhcmNoUmVzdWx0U3Rhci9TZWFyY2hSZXN1bHRTdGFyJztcclxuXHJcbmNvbnN0IFJlc3VsdHMgPSAoeyByZXN1bHRzLCB0eXBlLCBzZWFyY2hCYXJDbGFzcyB9KSA9PiB7XHJcbiAgbGV0IGNvbnRlbnQgPSB0eXBlID09PSAnYWQnID8gJ9ii2q/Zh9uMINmH2KcnIDogJ9io2KfZhtqpINin2LfZhNin2LnYp9iqJztcclxuXHJcbiAgbGV0IHJlc3VsdCA9XHJcbiAgICByZXN1bHRzICYmXHJcbiAgICByZXN1bHRzLm1hcCgoaXRtKSA9PiB7XHJcbiAgICAgIGxldCB1cmwgPSBgJHt0eXBlfS8ke2l0bS5pZH1gO1xyXG5cclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8bGkgY2xhc3NOYW1lPVwibGlzdC1ncm91cC1pdGVtXCIga2V5PXtpdG0uaWR9PlxyXG4gICAgICAgICAgPFNlYXJjaFJlc3VsdFN0YXIgY291bnQ9e2l0bS5hZFR5cGV9IC8+XHJcbiAgICAgICAgICA8TGluayBocmVmPVwiI1wiPlxyXG4gICAgICAgICAgICA8YT57aXRtLnRpdGxlfTwvYT5cclxuICAgICAgICAgIDwvTGluaz5cclxuICAgICAgICA8L2xpPlxyXG4gICAgICApO1xyXG4gICAgfSk7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8PlxyXG4gICAgICA8aDUgY2xhc3NOYW1lPXtgYmctd2hpdGUgdy01MCAke3N0eWxlcy5zZWFyY2hIZWFkaW5nfWB9PlxyXG4gICAgICAgINmG2KrbjNis2Ycg2KzYs9iq2KzZiCDYr9ixIHtjb250ZW50fVxyXG4gICAgICA8L2g1PlxyXG4gICAgICB7cmVzdWx0cyAmJiByZXN1bHRzLmxlbmd0aCA/IChcclxuICAgICAgICA8dWwgY2xhc3NOYW1lPXtgJHtzZWFyY2hCYXJDbGFzc30gJHtzdHlsZXMuc2VhcmNoQmFyVWx9YH0+e3Jlc3VsdH08L3VsPlxyXG4gICAgICApIDogKFxyXG4gICAgICAgIDxwXHJcbiAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlciBiZy13aGl0ZSB3LTUwXCJcclxuICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgIG1hcmdpblJpZ2h0OiAnMjMlJyxcclxuICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAnMCcsXHJcbiAgICAgICAgICAgIHBhZGRpbmdCb3R0b206ICcxMHB4JyxcclxuICAgICAgICAgIH19XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAg2YbYqtuM2KzZhyDYp9uMINuM2KfZgdiqINmG2LTYr1xyXG4gICAgICAgIDwvcD5cclxuICAgICAgKX1cclxuICAgIDwvPlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBSZXN1bHRzO1xyXG4iLCJpbXBvcnQgUmVzdWx0cyBmcm9tICcuL1Jlc3VsdHMvUmVzdWx0cyc7XHJcblxyXG5jb25zdCBTZWFyY2hCYXJSZXN1bHQgPSAoeyB1c2VyU2VhcmNoLCBzZWFyY2hCYXJDbGFzcyB9KSA9PiB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgaWQ9XCJzZWFyY2hCYXJPdmVyTGF5XCI+XHJcbiAgICAgIDxSZXN1bHRzXHJcbiAgICAgICAgcmVzdWx0cz17dXNlclNlYXJjaC5hZHN9XHJcbiAgICAgICAgdHlwZT1cImFkXCJcclxuICAgICAgICBzZWFyY2hCYXJDbGFzcz17c2VhcmNoQmFyQ2xhc3N9XHJcbiAgICAgIC8+XHJcbiAgICAgIDxSZXN1bHRzXHJcbiAgICAgICAgcmVzdWx0cz17dXNlclNlYXJjaC5pbmZvQmFua3N9XHJcbiAgICAgICAgdHlwZT1cImJhbmstaW5mb1wiXHJcbiAgICAgICAgc2VhcmNoQmFyQ2xhc3M9e3NlYXJjaEJhckNsYXNzfVxyXG4gICAgICAvPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFNlYXJjaEJhclJlc3VsdDtcclxuIiwiY29uc3QgU2VhcmNoUmVzdWx0U3RhciA9ICh7IGNvdW50IH0pID0+IHtcclxuICBsZXQgc3RhcnMgPSBbXTtcclxuXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudCArIDE7IGkrKykge1xyXG4gICAgc3RhcnMucHVzaChcclxuICAgICAgPGlcclxuICAgICAgICBjbGFzc05hbWU9XCJmYSBmYS1zdGFyXCJcclxuICAgICAgICBzdHlsZT17eyBjb2xvcjogJ2dvbGQnIH19XHJcbiAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcclxuICAgICAgICBrZXk9e2l9XHJcbiAgICAgID48L2k+XHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIDxzcGFuIHN0eWxlPXt7IG1hcmdpbkxlZnQ6ICcxMXB4JyB9fT57c3RhcnN9PC9zcGFuPjtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFNlYXJjaFJlc3VsdFN0YXI7XHJcbiIsImltcG9ydCBMb2NhdGlvbk1hcmsgZnJvbSAnLi4vTG9jYXRpb25NYXJrL0xvY2F0aW9uTWFyayc7XHJcbmltcG9ydCBMb2NhdGlvbk1vZGFsIGZyb20gJy4uL0xvY2F0aW9uTW9kYWwvTG9jYXRpb25Nb2RhbCc7XHJcbmltcG9ydCBzdHlsZXMgZnJvbSAnLi9DaXR5TGlzdC5tb2R1bGUuY3NzJztcclxuaW1wb3J0IEl0ZW1DaXR5IGZyb20gJy4vSXRlbUNpdHknO1xyXG5cclxuY29uc3QgQ2l0eUxpc3QgPSAoeyBjaXRpZXMgfSkgPT4ge1xyXG4gIGxldCBpdGVtQ2l0aWVzID1cclxuICAgIGNpdGllcyAmJlxyXG4gICAgY2l0aWVzLmxlbmd0aCAmJlxyXG4gICAgY2l0aWVzLm1hcCgoaXRtKSA9PiB7XHJcbiAgICAgIHJldHVybiA8SXRlbUNpdHkgY2l0eU5hbWU9e2l0bS5jaXR5fSBjaXR5SWQ9e2l0bS5pZH0gLz47XHJcbiAgICB9KTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPXtgZHJvcGRvd24gZC1mbGV4ICR7c3R5bGVzLmNpdHlMaXN0fWB9PlxyXG4gICAgICA8TG9jYXRpb25NYXJrIHRleHQ9e2ZhbHNlfSAvPlxyXG4gICAgICA8TG9jYXRpb25Nb2RhbCAvPlxyXG4gICAgICA8YnV0dG9uXHJcbiAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJ0bi13aGl0ZSBkcm9wZG93bi10b2dnbGUgYnRuLXNtIG1zLTFcIlxyXG4gICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgIGlkPVwiZHJvcERvd25DaXRpZXNcIlxyXG4gICAgICAgIGRhdGEtYnMtdG9nZ2xlPVwiZHJvcGRvd25cIlxyXG4gICAgICAgIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiXHJcbiAgICAgID5cclxuICAgICAgICDYtNmH2LEg2YfYp9uMINmF2YbYqtiu2KhcclxuICAgICAgPC9idXR0b24+XHJcbiAgICAgIDx1bCBjbGFzc05hbWU9XCJkcm9wZG93bi1tZW51IHNoYWRvdy1zbSBcIiBhcmlhLWxhYmVsbGVkYnk9XCJkcm9wRG93bkNpdGllc1wiPlxyXG4gICAgICAgIHtpdGVtQ2l0aWVzfVxyXG4gICAgICA8L3VsPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IENpdHlMaXN0O1xyXG4iLCJpbXBvcnQgeyBVc2VBcHBDb250ZXh0IH0gZnJvbSAnLi4vLi4vLi4vLi4vQ29udGV4dC9jb250ZXh0JztcclxuXHJcbmNvbnN0IEl0ZW1DaXR5ID0gKHsgY2l0eU5hbWUsIGNpdHlJZCB9KSA9PiB7XHJcbiAgY29uc3QgeyBkaXNwYXRjaENpdHkgfSA9IFVzZUFwcENvbnRleHQoKTtcclxuXHJcbiAgY29uc3QgcmVtb3ZlQ2l0eSA9IChlKSA9PiB7XHJcbiAgICBkaXNwYXRjaENpdHkoeyB0eXBlOiAncmVtb3ZlQ2l0eScsIHBheWxvYWQ6IHsgaWQ6IGUudGFyZ2V0LnZhbHVlIH0gfSk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxsaSBjbGFzc05hbWU9XCJkLWZsZXgganVzdGlmeS1jb250ZW50LWJldHdlZW4gYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImRyb3Bkb3duLWl0ZW1cIj57Y2l0eU5hbWV9PC9zcGFuPlxyXG4gICAgICA8YnV0dG9uXHJcbiAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgY2xhc3NOYW1lPVwiYnRuLWNsb3NlIGJ0bi1zbVwiXHJcbiAgICAgICAgYXJpYS1sYWJlbD1cIkNsb3NlXCJcclxuICAgICAgICB2YWx1ZT17Y2l0eUlkfVxyXG4gICAgICAgIG9uQ2xpY2s9eyhlKSA9PiByZW1vdmVDaXR5KGUpfVxyXG4gICAgICA+PC9idXR0b24+XHJcbiAgICA8L2xpPlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBJdGVtQ2l0eTtcclxuIiwiaW1wb3J0IHsgdXNlUXVlcnkgfSBmcm9tICdyZWFjdC1xdWVyeSc7XHJcbmltcG9ydCBnZXRSZXF1ZXN0IGZyb20gJy4uLy4uLy4uLy4uL1V0aWwvR0VUL2dldFJlcXVlc3QnO1xyXG5pbXBvcnQgUmVhY3RMb2FkaW5nIGZyb20gJ3JlYWN0LWxvYWRpbmcnO1xyXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBVc2VBcHBDb250ZXh0IH0gZnJvbSAnLi4vLi4vLi4vLi4vQ29udGV4dC9jb250ZXh0JztcclxuXHJcbmNvbnN0IENpdHkgPSAoeyBwcm92aW5jZUlkLCBzZXRDaXR5IH0pID0+IHtcclxuICBjb25zdCB7IGlzTG9hZGluZywgZGF0YSB9ID0gdXNlUXVlcnkoXHJcbiAgICBbJ2NpdGllcycsIHByb3ZpbmNlSWRdLFxyXG4gICAgZ2V0UmVxdWVzdChgL2FwaS9wcm92aW5jZS9nZXQvJHtwcm92aW5jZUlkfWApLFxyXG4gICAge1xyXG4gICAgICBlbmFibGVkOiAhIXByb3ZpbmNlSWQsXHJcbiAgICB9XHJcbiAgKTtcclxuXHJcbiAgY29uc3QgeyBjaXRpZXMgfSA9IFVzZUFwcENvbnRleHQoKTtcclxuXHJcbiAgY29uc3QgYWRkQ2l0eSA9IChlKSA9PiB7XHJcbiAgICBsZXQgc2VsZWN0ZWQgPSBBcnJheS5mcm9tKGUudGFyZ2V0Lm9wdGlvbnMpLmZpbHRlcihcclxuICAgICAgKG9wdGlvbikgPT4gb3B0aW9uLnNlbGVjdGVkXHJcbiAgICApO1xyXG5cclxuICAgIHNldENpdHkoeyBjaXR5OiBzZWxlY3RlZFswXS5kYXRhc2V0LnZhbHVlLCBpZDogc2VsZWN0ZWRbMF0udmFsdWUgfSk7XHJcbiAgfTtcclxuXHJcbiAgbGV0IG9wdGlvbkNpdGllcyA9XHJcbiAgICBkYXRhICYmXHJcbiAgICBkYXRhLkNpdGllcyAmJlxyXG4gICAgZGF0YS5DaXRpZXMubGVuZ3RoICYmXHJcbiAgICBfLnhvckJ5KGRhdGEuQ2l0aWVzLCBjaXRpZXMsICdpZCcpLm1hcCgoaXRtKSA9PiB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPG9wdGlvbiBrZXk9e2l0bS5pZH0gdmFsdWU9e2l0bS5pZH0gZGF0YS12YWx1ZT17aXRtLmNpdHl9PlxyXG4gICAgICAgICAge2l0bS5jaXR5fVxyXG4gICAgICAgIDwvb3B0aW9uPlxyXG4gICAgICApO1xyXG4gICAgfSk7XHJcblxyXG4gIGlmIChpc0xvYWRpbmcpIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxSZWFjdExvYWRpbmcgdHlwZT1cImJ1YmJsZXNcIiBjb2xvcj1cIiM2YjZiNmJcIiBoZWlnaHQ9ezQwfSB3aWR0aD17NDB9IC8+XHJcbiAgICApO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8c2VsZWN0IGNsYXNzTmFtZT1cImZvcm0tc2VsZWN0XCIgb25DaGFuZ2U9eyhlKSA9PiBhZGRDaXR5KGUpfT5cclxuICAgICAgICA8b3B0aW9uPtmE2LfZgdinINi02YfYsSDZhdmI2LHYryDZhti42LEg2LHYpyDYp9mG2KrYrtin2Kgg2qnZhtuM2K88L29wdGlvbj5cclxuICAgICAgICB7b3B0aW9uQ2l0aWVzfVxyXG4gICAgICA8L3NlbGVjdD5cclxuICAgICk7XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgQ2l0eTtcclxuIiwiaW1wb3J0IExvY2F0aW9uTWFyayBmcm9tICcuL0xvY2F0aW9uTWFyay9Mb2NhdGlvbk1hcmsnO1xyXG5pbXBvcnQgc3R5bGVzIGZyb20gJy4vTG9jYXRpb24ubW9kdWxlLmNzcyc7XHJcbmltcG9ydCBMb2NhdGlvbk1vZGFsIGZyb20gJy4vTG9jYXRpb25Nb2RhbC9Mb2NhdGlvbk1vZGFsJztcclxuXHJcbmNvbnN0IExvY2F0aW9uID0gKCkgPT4ge1xyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIGNsYXNzTmFtZT17YGNvbC1sZy02IGNvbC0xIGQtZmxleCBqdXN0aWZ5LWNvbnRlbnQtZW5kICR7c3R5bGVzLmxvY2F0aW9ufWB9XHJcbiAgICA+XHJcbiAgICAgIDxMb2NhdGlvbk1hcmsgdGV4dD17dHJ1ZX0gLz5cclxuICAgICAgPExvY2F0aW9uTW9kYWwgLz5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBMb2NhdGlvbjtcclxuIiwiaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgVXNlQXBwQ29udGV4dCB9IGZyb20gJy4uLy4uLy4uLy4uL0NvbnRleHQvY29udGV4dCc7XHJcblxyXG5jb25zdCBMb2NhdGlvbk1hcmsgPSAoeyB0ZXh0IH0pID0+IHtcclxuICBjb25zdCBbaWNvbiwgc2V0SWNvbl0gPSB1c2VTdGF0ZSgnZmEgZmEtbWFwLW1hcmtlcicpO1xyXG5cclxuICBjb25zdCB7IGNpdGllcyB9ID0gVXNlQXBwQ29udGV4dCgpO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKGNpdGllcy5sZW5ndGgpIHtcclxuICAgICAgc2V0SWNvbignZmFzIGZhLXBsdXMnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHNldEljb24oJ2ZhIGZhLW1hcC1tYXJrZXInKTtcclxuICAgIH1cclxuICB9LCBbY2l0aWVzXSk7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImQtZmxleFwiPlxyXG4gICAgICA8YnV0dG9uXHJcbiAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgZGF0YS1icy10b2dnbGU9XCJtb2RhbFwiXHJcbiAgICAgICAgZGF0YS1icy10YXJnZXQ9XCIjbG9jYXRpb25Nb2RhbFwiXHJcbiAgICAgICAgY2xhc3NOYW1lPVwiYmctd2hpdGVcIlxyXG4gICAgICA+XHJcbiAgICAgICAgPGkgY2xhc3NOYW1lPXtpY29ufSBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XHJcbiAgICAgIDwvYnV0dG9uPlxyXG4gICAgICB7dGV4dCAmJiAoXHJcbiAgICAgICAgPHAgY2xhc3NOYW1lPVwiZC1ub25lIGQtbGctYmxvY2sgbWItMCBtcy0yXCI+2LTZh9ixINiu2YjYryDYsdinINin2YbYqtiu2KfYqCDaqdmG24zYrzwvcD5cclxuICAgICAgKX1cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBMb2NhdGlvbk1hcms7XHJcbiIsImltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBDaXR5IGZyb20gJy4uL0NpdHkvQ2l0eSc7XHJcbmltcG9ydCBQcm92aW5jZSBmcm9tICcuLi9Qcm92aW5jZS9Qcm92aW5jZSc7XHJcbmltcG9ydCB7IFVzZUFwcENvbnRleHQgfSBmcm9tICcuLi8uLi8uLi8uLi9Db250ZXh0L2NvbnRleHQnO1xyXG5cclxuY29uc3QgTG9jYXRpb25Nb2RhbCA9ICgpID0+IHtcclxuICBjb25zdCBbcHJvdmluY2UsIHNldFByb3ZpbmNlXSA9IHVzZVN0YXRlKG51bGwpO1xyXG4gIGNvbnN0IFtjaXR5LCBzZXRDaXR5XSA9IHVzZVN0YXRlKG51bGwpO1xyXG5cclxuICBjb25zdCB7IGRpc3BhdGNoQ2l0eSB9ID0gVXNlQXBwQ29udGV4dCgpO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgZnVuY3Rpb24gcmVtTG9jKGUpIHtcclxuICAgICAgbGV0IHRhcmdldCA9IGUudGFyZ2V0LmNsb3Nlc3QoJyNsb2NhdGlvbk1vZGFsJyk7XHJcblxyXG4gICAgICBpZiAoIXRhcmdldCkge1xyXG4gICAgICAgIHNldFByb3ZpbmNlKG51bGwpO1xyXG4gICAgICAgIHNldENpdHkobnVsbCk7XHJcbiAgICAgIH0gZWxzZSByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCByZW1Mb2MpO1xyXG5cclxuICAgIHJldHVybiAoKSA9PiBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHJlbUxvYyk7XHJcbiAgfSwgW10pO1xyXG5cclxuICBjb25zdCBkaXNwb3NlTW9kYWwgPSAoKSA9PiB7XHJcbiAgICBkaXNwYXRjaENpdHkoe1xyXG4gICAgICB0eXBlOiAnYWRkQ2l0eScsXHJcbiAgICAgIHBheWxvYWQ6IHsgaWQ6IGNpdHkuaWQsIGNpdHk6IGNpdHkuY2l0eSB9LFxyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgcmVmcmVzaExvYyA9ICgpID0+IHtcclxuICAgIHNldFByb3ZpbmNlKG51bGwpO1xyXG4gICAgc2V0Q2l0eShudWxsKTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdlxyXG4gICAgICBjbGFzc05hbWU9XCJtb2RhbCBmYWRlXCJcclxuICAgICAgaWQ9XCJsb2NhdGlvbk1vZGFsXCJcclxuICAgICAgdGFiSW5kZXg9XCItMVwiXHJcbiAgICAgIGFyaWEtbGFiZWxsZWRieT1cImxvY2F0aW9uTW9kYWxMYWJlbFwiXHJcbiAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXHJcbiAgICA+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtZGlhbG9nXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1jb250ZW50XCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWhlYWRlclwiPlxyXG4gICAgICAgICAgICA8aDUgY2xhc3NOYW1lPVwibW9kYWwtdGl0bGVcIiBpZD1cImxvY2F0aW9uTW9kYWxMYWJlbFwiPlxyXG4gICAgICAgICAgICAgINin2YbYqtiu2KfYqCDYp9iz2KrYp9mGINmIINi02YfYsVxyXG4gICAgICAgICAgICA8L2g1PlxyXG4gICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuLWNsb3NlXCJcclxuICAgICAgICAgICAgICBkYXRhLWJzLWRpc21pc3M9XCJtb2RhbFwiXHJcbiAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIkNsb3NlXCJcclxuICAgICAgICAgICAgICBvbkNsaWNrPXtyZWZyZXNoTG9jfVxyXG4gICAgICAgICAgICA+PC9idXR0b24+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtYm9keSBkLWZsZXgganVzdGlmeS1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgICAgICAgICB7cHJvdmluY2UgPyAoXHJcbiAgICAgICAgICAgICAgPENpdHkgcHJvdmluY2VJZD17cHJvdmluY2V9IHNldENpdHk9e3NldENpdHl9IC8+XHJcbiAgICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgICAgPFByb3ZpbmNlIHNldFByb3ZpbmNlPXtzZXRQcm92aW5jZX0gLz5cclxuICAgICAgICAgICAgKX1cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1mb290ZXJcIj5cclxuICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiXHJcbiAgICAgICAgICAgICAgZGF0YS1icy1kaXNtaXNzPVwibW9kYWxcIlxyXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e2Rpc3Bvc2VNb2RhbH1cclxuICAgICAgICAgICAgICBkaXNhYmxlZD17cHJvdmluY2UgPyBmYWxzZSA6IHRydWV9XHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICDYq9io2KpcclxuICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgTG9jYXRpb25Nb2RhbDtcclxuIiwiaW1wb3J0IHsgdXNlUXVlcnkgfSBmcm9tICdyZWFjdC1xdWVyeSc7XHJcbmltcG9ydCBnZXRSZXF1ZXN0IGZyb20gJy4uLy4uLy4uLy4uL1V0aWwvR0VUL2dldFJlcXVlc3QnO1xyXG5pbXBvcnQgUmVhY3RMb2FkaW5nIGZyb20gJ3JlYWN0LWxvYWRpbmcnO1xyXG5cclxuY29uc3QgUHJvdmluY2UgPSAoeyBzZXRQcm92aW5jZSB9KSA9PiB7XHJcbiAgY29uc3QgeyBpc0xvYWRpbmcsIGRhdGEgfSA9IHVzZVF1ZXJ5KFxyXG4gICAgJ3Byb3ZpbmNlcycsXHJcbiAgICBnZXRSZXF1ZXN0KCcvYXBpL3Byb3ZpbmNlL2dldGFsbCcpXHJcbiAgKTtcclxuXHJcbiAgY29uc3QgY2hvb3NlUHJvdmluY2UgPSAoZSkgPT4ge1xyXG4gICAgc2V0UHJvdmluY2UoZS50YXJnZXQudmFsdWUpO1xyXG4gIH07XHJcblxyXG4gIGxldCBwcm92aW5jZXMgPVxyXG4gICAgZGF0YSAmJlxyXG4gICAgZGF0YS5sZW5ndGggJiZcclxuICAgIGRhdGEubWFwKChpdG0pID0+IHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8b3B0aW9uIGtleT17aXRtLmlkfSB2YWx1ZT17aXRtLmlkfT5cclxuICAgICAgICAgIHtpdG0ucHJvdmluY2V9XHJcbiAgICAgICAgPC9vcHRpb24+XHJcbiAgICAgICk7XHJcbiAgICB9KTtcclxuXHJcbiAgaWYgKGlzTG9hZGluZykge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgPFJlYWN0TG9hZGluZyB0eXBlPVwiYnViYmxlc1wiIGNvbG9yPVwiIzZiNmI2YlwiIGhlaWdodD17NDB9IHdpZHRoPXs0MH0gLz5cclxuICAgICk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxzZWxlY3QgY2xhc3NOYW1lPVwiZm9ybS1zZWxlY3RcIiBvbkNoYW5nZT17KGUpID0+IGNob29zZVByb3ZpbmNlKGUpfT5cclxuICAgICAgICA8b3B0aW9uPtmE2LfZgdinINin2LPYqtin2YYg2YXZiNix2K8g2YbYuNixINix2Kcg2KfZhtiq2K7Yp9ioINqp2YbbjNivPC9vcHRpb24+XHJcbiAgICAgICAge3Byb3ZpbmNlc31cclxuICAgICAgPC9zZWxlY3Q+XHJcbiAgICApO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFByb3ZpbmNlO1xyXG4iLCJpbXBvcnQgTG9jYXRpb24gZnJvbSAnLi4vTG9jYXRpb24vTG9jYXRpb24nO1xyXG5pbXBvcnQgUGF0aCBmcm9tICcuLi9QYXRoL1BhdGgnO1xyXG5pbXBvcnQgeyBVc2VBcHBDb250ZXh0IH0gZnJvbSAnLi4vLi4vLi4vQ29udGV4dC9jb250ZXh0JztcclxuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IENpdHlMaXN0IGZyb20gJy4uL0xvY2F0aW9uL0NpdHlMaXN0L0NpdHlMaXN0JztcclxuXHJcbmNvbnN0IE5hdmlnYXRpb25XcmFwcGVyID0gKCkgPT4ge1xyXG4gIGNvbnN0IFtjaG9vc2VDaXR5LCBzZXRDaG9vc2VDaXR5XSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuICBjb25zdCB7IGNpdGllcyB9ID0gVXNlQXBwQ29udGV4dCgpO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKGNpdGllcy5sZW5ndGgpIHtcclxuICAgICAgc2V0Q2hvb3NlQ2l0eSh0cnVlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHNldENob29zZUNpdHkoZmFsc2UpO1xyXG4gICAgfVxyXG4gIH0sIFtjaXRpZXNdKTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyLWZsdWlkIHB4LTUgbWItM1wiPlxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLXdoaXRlIHJvdW5kZWQtcGlsbCBkLWZsZXggcHgtMyBqdXN0aWZ5LWNvbnRlbnQtYmV0d2VlbiBhbGlnbi1pdGVtcy1jZW50ZXIgc2hhZG93LXNtXCI+XHJcbiAgICAgICAgPFBhdGggLz5cclxuICAgICAgICB7Y2hvb3NlQ2l0eSA/IDxDaXR5TGlzdCBjaXRpZXM9e2NpdGllc30gLz4gOiA8TG9jYXRpb24gLz59XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IE5hdmlnYXRpb25XcmFwcGVyO1xyXG4iLCJpbXBvcnQgQnJlYWRjcnVtYnMgZnJvbSAnbmV4dGpzLWJyZWFkY3J1bWJzJztcclxuY29uc3QgUGF0aCA9ICgpID0+IHtcclxuICBjb25zdCBjaGFuZ2VMYWJlbCA9ICh0aXRsZSkgPT4ge1xyXG4gICAgc3dpdGNoICh0aXRsZSkge1xyXG4gICAgICBjYXNlICdIb21lJzpcclxuICAgICAgICByZXR1cm4gJ9iu2KfZhtmHJztcclxuXHJcbiAgICAgIGNhc2UgJ3Rlc3QnOlxyXG4gICAgICAgIHJldHVybiAn2KrYs9iqJztcclxuXHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgcmV0dXJuIHRpdGxlO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8QnJlYWRjcnVtYnNcclxuICAgICAgcm9vdExhYmVsPVwiSG9tZVwiXHJcbiAgICAgIHRyYW5zZm9ybUxhYmVsPXtjaGFuZ2VMYWJlbH1cclxuICAgICAgbGlzdENsYXNzTmFtZT1cImJyZWFkY3J1bWIgbS0wXCJcclxuICAgICAgaW5hY3RpdmVJdGVtQ2xhc3NOYW1lPVwiYnJlYWRjcnVtYi1pdGVtXCJcclxuICAgICAgYWN0aXZlSXRlbUNsYXNzTmFtZT1cImJyZWFkY3J1bWItaXRlbSBhY3RpdmVcIlxyXG4gICAgLz5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgUGF0aDtcclxuIiwiaW1wb3J0IHN0eWxlcyBmcm9tICcuL1NTQnV0dG9uLm1vZHVsZS5jc3MnO1xyXG5pbXBvcnQgeyB1c2VSb3V0ZXIgfSBmcm9tICduZXh0L3JvdXRlcic7XHJcblxyXG5jb25zdCBTaWduVXBTaWduSW5CdXR0b24gPSAoeyBkZXNrdG9wU2l6ZSB9KSA9PiB7XHJcbiAgY29uc3Qgcm91dGVyID0gdXNlUm91dGVyKCk7XHJcblxyXG4gIGlmIChkZXNrdG9wU2l6ZSkge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgPD5cclxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT17YCR7c3R5bGVzLmdsb3dTaWduSW5CdXR0b259YH0gdHlwZT1cImJ1dHRvblwiPlxyXG4gICAgICAgICAg2YjYsdmI2K9cclxuICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT17YCR7c3R5bGVzLmdsb3dTaWduVXBCdXR0b259YH0gdHlwZT1cImJ1dHRvblwiPlxyXG4gICAgICAgICAg2KvYqNiqINmG2KfZhVxyXG4gICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICA8Lz5cclxuICAgICk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIDw+XHJcbiAgICAgICAgPGRpdlxyXG4gICAgICAgICAgY2xhc3NOYW1lPXtgZC1mbGV4IGZsZXgtY29sdW1uIGFsaWduLWl0ZW1zLWNlbnRlciAke3N0eWxlcy5zaWduSW5CdG5Nb2JpbGV9YH1cclxuICAgICAgICA+XHJcbiAgICAgICAgICA8aSBjbGFzc05hbWU9XCJmYXMgZmEtc2lnbi1pbi1hbHRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XHJcbiAgICAgICAgICA8c3Bhbj7ZiNix2YjYrzwvc3Bhbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2XHJcbiAgICAgICAgICBjbGFzc05hbWU9e2BkLWZsZXggZmxleC1jb2x1bW4gbXMtNSBhbGlnbi1pdGVtcy1jZW50ZXIgJHtzdHlsZXMuc2lnblVwQnRuTW9iaWxlfWB9XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZmFzIGZhLXVzZXItcGx1c1wiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cclxuICAgICAgICAgIDxzcGFuPtir2KjYqiDZhtin2YU8L3NwYW4+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvPlxyXG4gICAgKTtcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTaWduVXBTaWduSW5CdXR0b247XHJcbiIsImZ1bmN0aW9uIGludFRvU3RyaW5nKG51bSkge1xyXG4gIGlmIChudW0gPCAxMDAwKSB7XHJcbiAgICByZXR1cm4gbnVtO1xyXG4gIH1cclxuICB2YXIgc2kgPSBbXHJcbiAgICB7IHY6IDFlMywgczogXCJLXCIgfSxcclxuICAgIHsgdjogMWU2LCBzOiBcIk1cIiB9LFxyXG4gICAgeyB2OiAxZTksIHM6IFwiQlwiIH0sXHJcbiAgICB7IHY6IDFlMTIsIHM6IFwiVFwiIH0sXHJcbiAgICB7IHY6IDFlMTUsIHM6IFwiUFwiIH0sXHJcbiAgICB7IHY6IDFlMTgsIHM6IFwiRVwiIH0sXHJcbiAgXTtcclxuICB2YXIgaTtcclxuICBmb3IgKGkgPSBzaS5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XHJcbiAgICBpZiAobnVtID49IHNpW2ldLnYpIHtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiAoXHJcbiAgICAobnVtIC8gc2lbaV0udikudG9GaXhlZCgyKS5yZXBsYWNlKC9cXC4wKyR8KFxcLlswLTldKlsxLTldKTArJC8sIFwiJDFcIikgK1xyXG4gICAgc2lbaV0uc1xyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGludFRvU3RyaW5nO1xyXG4iLCJjb25zdCB7IEJBU0VfVVJMIH0gPSByZXF1aXJlKCcuLi8uLi9CQVNFX1VSTC9iYXNlVXJsJyk7XHJcblxyXG5jb25zdCBnZXRSZXF1ZXN0ID0gKHVybCkgPT4ge1xyXG4gIHJldHVybiBhc3luYyAoKSA9PiB7XHJcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgZmV0Y2goQkFTRV9VUkwgKyB1cmwsIHtcclxuICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgY3JlZGVudGlhbHM6ICdpbmNsdWRlJyxcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGpzb25pemVkRGF0YSA9IGF3YWl0IGRhdGEuanNvbigpO1xyXG4gICAgcmV0dXJuIGpzb25pemVkRGF0YTtcclxuICB9O1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBnZXRSZXF1ZXN0O1xyXG4iLCJleHBvcnQgZGVmYXVsdCAge1wic3JjXCI6XCIvX25leHQvc3RhdGljL2ltYWdlL3B1YmxpYy9hZC5hZjY1MzMyZTYzODEyZTBkY2E0ZDk1NmUzNWRiODc4Mi5zdmdcIixcImhlaWdodFwiOjI0LFwid2lkdGhcIjoyNH07IiwiZXhwb3J0IGRlZmF1bHQgIHtcInNyY1wiOlwiL19uZXh0L3N0YXRpYy9pbWFnZS9wdWJsaWMvYmxvZy5kYTc0M2M4ZjExODY3ZTk5NWYwNmI2ZTQ2ZWZiMDc0NS5zdmdcIixcImhlaWdodFwiOjI0LFwid2lkdGhcIjoyMX07IiwiZXhwb3J0IGRlZmF1bHQgIHtcInNyY1wiOlwiL19uZXh0L3N0YXRpYy9pbWFnZS9wdWJsaWMvaW5mby5hYzNhNWRlYzE5YTRmM2U1NWU5ZmI4MDg2OTkzZTRhNC5zdmdcIixcImhlaWdodFwiOjI0LFwid2lkdGhcIjoyMH07IiwiZXhwb3J0IGRlZmF1bHQgIHtcInNyY1wiOlwiL19uZXh0L3N0YXRpYy9pbWFnZS9wdWJsaWMvbG9nby40NjgwZGM3MWMzYzMwMjA5NDQwYTNjOTY5OGU5ZTMyZC5wbmdcIixcImhlaWdodFwiOjEwMyxcIndpZHRoXCI6NzcsXCJibHVyRGF0YVVSTFwiOlwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFBWUFBQUFJQ0FZQUFBRGF4bzQ0QUFBQXIwbEVRVlI0Mm1OWVViK0FoUUVJRHMzZkk3cDcwYzVXRUx0UHU0cUpBUVpXOWE0OHZLcC81VnU0d0s2Rk85clhUVmx6ZmRPa3J2K2JKemIvWDlhMTZNeVMxa1Z5REJ1bnJEVmUxcm4wMmRaSmRmKzNUNjMvdjZKditlL05zemN0Qk90Ni9tQWY3N3JKcTk0Q1ZiOCtlV2laS0ZnUVllVE92cFU5eTB6Z0FrVXE2UXExMXNWR0d4YXNFUVR4cDZSMnNjMUltQ3JHVUtLVk5hUEtxR0JtdlZscFo2ZFhVMWQvVUdmRmpQZ3BqUURmVjA1RjNzcWpSQUFBQUFCSlJVNUVya0pnZ2c9PVwifTsiLCJleHBvcnQgZGVmYXVsdCAge1wic3JjXCI6XCIvX25leHQvc3RhdGljL2ltYWdlL3B1YmxpYy9tb2JpbGVsb2dvLmM2ZjM5ZTEzOTYzNWVkNGM2YTA3MWNjNzJlYTlhOTkxLnBuZ1wiLFwiaGVpZ2h0XCI6NTYsXCJ3aWR0aFwiOjU0LFwiYmx1ckRhdGFVUkxcIjpcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQWdBQUFBSUNBWUFBQURFRDc2TEFBQUE3MGxFUVZSNDJtTUFnU3RIcnpJeFFNSGhOWWNtSE55Nlh4UEVQbm5nQkNNRE1samR2bnorOHJZbC8rODlmaTBENHU5Y3NaT0Y0ZnUvTDJ6Ly8vOW4yVDV6VWRlSzNpWC9WMDljOFgvdGhPbEw0THEyemRweVpIWHZpamRySnk3K3Y2Vy82UGUyL3N6ZnEzcG4vMS9ZdU9EVXpyV2JSUm4yTE51cHM3aHgvdU9WZll2Lzc1NGMvM3Z2dE5UZmF5WXQvYitzZmZIL0RaUFhYV0lBZ1V1MzMvT3U3WjI4ZGQza0pmOVg5aTc4djdLcjk4Q3A0NWUweng0NHJjQ3dlK2x1VnBDaS8vLy9DNi9xWFA1M1lmMjhxeGNmdk9kaFFBZlA3endWMjdWd3g2NXRhemNKZ2ZpYjUyOW12WGo4QWlNQUx3aDdjck9pT2lrQUFBQUFTVVZPUks1Q1lJST1cIn07IiwiLy8gRXhwb3J0c1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwibWVudVwiOiBcIkJ1cmdlck1lbnVfbWVudV9fM2JCbl9cIixcblx0XCJsaW5lXCI6IFwiQnVyZ2VyTWVudV9saW5lX18yRVRhTVwiLFxuXHRcImxpbmUxXCI6IFwiQnVyZ2VyTWVudV9saW5lMV9fNk42LVlcIixcblx0XCJsaW5lMlwiOiBcIkJ1cmdlck1lbnVfbGluZTJfXzd5NGMtXCIsXG5cdFwibGluZTNcIjogXCJCdXJnZXJNZW51X2xpbmUzX18zam1VLVwiLFxuXHRcIm9wZW5lZFwiOiBcIkJ1cmdlck1lbnVfb3BlbmVkX18xMWZlVlwiXG59O1xuIiwiLy8gRXhwb3J0c1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwiUWJ0blwiOiBcIkZBUV9RYnRuX19fNDRNT1wiXG59O1xuIiwiLy8gRXhwb3J0c1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwic3ViSGVhZGVyXCI6IFwiU3ViSGVhZGVyX3N1YkhlYWRlcl9fM2FlLThcIixcblx0XCJtaWRTdWJIZWFkZXJcIjogXCJTdWJIZWFkZXJfbWlkU3ViSGVhZGVyX18xWFBXN1wiXG59O1xuIiwiLy8gRXhwb3J0c1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwic2VhcmNoQmFyQW5kTGlua3NXcmFwcGVyXCI6IFwiSGVhZGVyV3JhcHBlcl9zZWFyY2hCYXJBbmRMaW5rc1dyYXBwZXJfXzNfc2pCXCIsXG5cdFwibmF2QmFyXCI6IFwiSGVhZGVyV3JhcHBlcl9uYXZCYXJfX2trNlZNXCJcbn07XG4iLCIvLyBFeHBvcnRzXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0XCJoZWFkZXJJY29uc1dyYXBwZXJcIjogXCJJY29uc19oZWFkZXJJY29uc1dyYXBwZXJfX19sWjZLXCIsXG5cdFwiZnVsbFwiOiBcIkljb25zX2Z1bGxfXzJuWllpXCIsXG5cdFwiaGVhZGVySWNvbldyYXBwZXJNb2JpbGVcIjogXCJJY29uc19oZWFkZXJJY29uV3JhcHBlck1vYmlsZV9fMk9YeGtcIixcblx0XCJ3aWdnbGVcIjogXCJJY29uc193aWdnbGVfXzFsSzYtXCIsXG5cdFwidXNlckJhZGdlXCI6IFwiSWNvbnNfdXNlckJhZGdlX194ZklEdFwiXG59O1xuIiwiLy8gRXhwb3J0c1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwibXlcIjogXCJNeV9teV9fM1NYclNcIlxufTtcbiIsIi8vIEV4cG9ydHNcbm1vZHVsZS5leHBvcnRzID0ge1xuXHRcInNlYXJjaEJhck92ZXJMYXlSZXN1bHRzXCI6IFwiT3ZlcmxheV9zZWFyY2hCYXJPdmVyTGF5UmVzdWx0c19fMlhzLTZcIixcblx0XCJzaG93U3R5bGVcIjogXCJPdmVybGF5X3Nob3dTdHlsZV9fbV9mRTFcIixcblx0XCJkcm9wcGVkTWVudVwiOiBcIk92ZXJsYXlfZHJvcHBlZE1lbnVfXzJ4OVZ0XCIsXG5cdFwiZHJvcHBlZE1lbnVIZWlnaHRcIjogXCJPdmVybGF5X2Ryb3BwZWRNZW51SGVpZ2h0X18yVWlCRlwiXG59O1xuIiwiLy8gRXhwb3J0c1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwiaGVhZGVyTGlua1wiOiBcIkhlYWRlckxpbmtfaGVhZGVyTGlua19fVmhaa1BcIixcblx0XCJzbWFsbEhlYWRlckxpbmtcIjogXCJIZWFkZXJMaW5rX3NtYWxsSGVhZGVyTGlua19fMzBIYzhcIixcblx0XCJodnItcHVsc2UtZ3Jvd1wiOiBcIkhlYWRlckxpbmtfaHZyLXB1bHNlLWdyb3dfXzJhR211XCJcbn07XG4iLCIvLyBFeHBvcnRzXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0XCJyb3VuZGVkSW5wdXRcIjogXCJTZWFyY2hCYXJfcm91bmRlZElucHV0X18zTjJlM1wiLFxuXHRcInJvdW5kZWRJY29uXCI6IFwiU2VhcmNoQmFyX3JvdW5kZWRJY29uX19TSnZDZ1wiLFxuXHRcInNlYXJjaEJhclwiOiBcIlNlYXJjaEJhcl9zZWFyY2hCYXJfXzNQdmRiXCIsXG5cdFwic21hbGxSb3VuZGVkSWNvblwiOiBcIlNlYXJjaEJhcl9zbWFsbFJvdW5kZWRJY29uX18xTmphR1wiXG59O1xuIiwiLy8gRXhwb3J0c1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwidXNlckluZm9IZWFkZXJcIjogXCJVc2VyX3VzZXJJbmZvSGVhZGVyX18xWS1HSlwiLFxuXHRcInVzZXJJbmZvSGVhZGVyTW9iaWxlXCI6IFwiVXNlcl91c2VySW5mb0hlYWRlck1vYmlsZV9fMXV5dmhcIlxufTtcbiIsIi8vIEV4cG9ydHNcbm1vZHVsZS5leHBvcnRzID0ge1xuXHRcInNlYXJjaEJhclVsXCI6IFwiUmVzdWx0c19zZWFyY2hCYXJVbF9fMkRmTTZcIixcblx0XCJzZWFyY2hIZWFkaW5nXCI6IFwiUmVzdWx0c19zZWFyY2hIZWFkaW5nX18zanRCaVwiXG59O1xuIiwiLy8gRXhwb3J0c1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwiY2l0eUxpc3RcIjogXCJDaXR5TGlzdF9jaXR5TGlzdF9fMlp2cXJcIlxufTtcbiIsIi8vIEV4cG9ydHNcbm1vZHVsZS5leHBvcnRzID0ge1xuXHRcImxvY2F0aW9uXCI6IFwiTG9jYXRpb25fbG9jYXRpb25fX2ZKV2ZmXCJcbn07XG4iLCIvLyBFeHBvcnRzXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0XCJnbG93U2lnblVwQnV0dG9uXCI6IFwiU1NCdXR0b25fZ2xvd1NpZ25VcEJ1dHRvbl9fQVRsVlRcIixcblx0XCJnbG93U2lnbkluQnV0dG9uXCI6IFwiU1NCdXR0b25fZ2xvd1NpZ25JbkJ1dHRvbl9fMjNKUWxcIixcblx0XCJnbG93aW5nXCI6IFwiU1NCdXR0b25fZ2xvd2luZ19fMVVXa2FcIixcblx0XCJzaWduSW5CdG5Nb2JpbGVcIjogXCJTU0J1dHRvbl9zaWduSW5CdG5Nb2JpbGVfX3FaSWdRXCIsXG5cdFwic2lnblVwQnRuTW9iaWxlXCI6IFwiU1NCdXR0b25fc2lnblVwQnRuTW9iaWxlX19QWGF2d1wiLFxuXHRcImh2ci13b2JibGUtaG9yaXpvbnRhbFwiOiBcIlNTQnV0dG9uX2h2ci13b2JibGUtaG9yaXpvbnRhbF9fM0NMWDJcIlxufTtcbiIsIlwidXNlIHN0cmljdFwiO2V4cG9ydHMuX19lc01vZHVsZT10cnVlO2V4cG9ydHMubm9ybWFsaXplUGF0aFNlcD1ub3JtYWxpemVQYXRoU2VwO2V4cG9ydHMuZGVub3JtYWxpemVQYWdlUGF0aD1kZW5vcm1hbGl6ZVBhZ2VQYXRoO2Z1bmN0aW9uIG5vcm1hbGl6ZVBhdGhTZXAocGF0aCl7cmV0dXJuIHBhdGgucmVwbGFjZSgvXFxcXC9nLCcvJyk7fWZ1bmN0aW9uIGRlbm9ybWFsaXplUGFnZVBhdGgocGFnZSl7cGFnZT1ub3JtYWxpemVQYXRoU2VwKHBhZ2UpO2lmKHBhZ2Uuc3RhcnRzV2l0aCgnL2luZGV4LycpKXtwYWdlPXBhZ2Uuc2xpY2UoNik7fWVsc2UgaWYocGFnZT09PScvaW5kZXgnKXtwYWdlPScvJzt9cmV0dXJuIHBhZ2U7fVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGVub3JtYWxpemUtcGFnZS1wYXRoLmpzLm1hcCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9kaXN0L2NsaWVudC9pbWFnZScpXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZGlzdC9jbGllbnQvbGluaycpXG4iLCJmdW5jdGlvbiBfZXh0ZW5kcygpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkge1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldO1xuXG4gICAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH07XG5cbiAgcmV0dXJuIF9leHRlbmRzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2V4dGVuZHM7IiwiZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHtcbiAgICBcImRlZmF1bHRcIjogb2JqXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdDsiLCJ2YXIgX3R5cGVvZiA9IHJlcXVpcmUoXCJAYmFiZWwvcnVudGltZS9oZWxwZXJzL3R5cGVvZlwiKTtcblxuZnVuY3Rpb24gX2dldFJlcXVpcmVXaWxkY2FyZENhY2hlKCkge1xuICBpZiAodHlwZW9mIFdlYWtNYXAgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIG51bGw7XG4gIHZhciBjYWNoZSA9IG5ldyBXZWFrTWFwKCk7XG5cbiAgX2dldFJlcXVpcmVXaWxkY2FyZENhY2hlID0gZnVuY3Rpb24gX2dldFJlcXVpcmVXaWxkY2FyZENhY2hlKCkge1xuICAgIHJldHVybiBjYWNoZTtcbiAgfTtcblxuICByZXR1cm4gY2FjaGU7XG59XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKG9iaikge1xuICBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIGlmIChvYmogPT09IG51bGwgfHwgX3R5cGVvZihvYmopICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiBvYmogIT09IFwiZnVuY3Rpb25cIikge1xuICAgIHJldHVybiB7XG4gICAgICBcImRlZmF1bHRcIjogb2JqXG4gICAgfTtcbiAgfVxuXG4gIHZhciBjYWNoZSA9IF9nZXRSZXF1aXJlV2lsZGNhcmRDYWNoZSgpO1xuXG4gIGlmIChjYWNoZSAmJiBjYWNoZS5oYXMob2JqKSkge1xuICAgIHJldHVybiBjYWNoZS5nZXQob2JqKTtcbiAgfVxuXG4gIHZhciBuZXdPYmogPSB7fTtcbiAgdmFyIGhhc1Byb3BlcnR5RGVzY3JpcHRvciA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuXG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xuICAgICAgdmFyIGRlc2MgPSBoYXNQcm9wZXJ0eURlc2NyaXB0b3IgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwga2V5KSA6IG51bGw7XG5cbiAgICAgIGlmIChkZXNjICYmIChkZXNjLmdldCB8fCBkZXNjLnNldCkpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5ld09iaiwga2V5LCBkZXNjKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld09ialtrZXldID0gb2JqW2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmV3T2JqW1wiZGVmYXVsdFwiXSA9IG9iajtcblxuICBpZiAoY2FjaGUpIHtcbiAgICBjYWNoZS5zZXQob2JqLCBuZXdPYmopO1xuICB9XG5cbiAgcmV0dXJuIG5ld09iajtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZDsiLCJmdW5jdGlvbiBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShzb3VyY2UsIGV4Y2x1ZGVkKSB7XG4gIGlmIChzb3VyY2UgPT0gbnVsbCkgcmV0dXJuIHt9O1xuICB2YXIgdGFyZ2V0ID0ge307XG4gIHZhciBzb3VyY2VLZXlzID0gT2JqZWN0LmtleXMoc291cmNlKTtcbiAgdmFyIGtleSwgaTtcblxuICBmb3IgKGkgPSAwOyBpIDwgc291cmNlS2V5cy5sZW5ndGg7IGkrKykge1xuICAgIGtleSA9IHNvdXJjZUtleXNbaV07XG4gICAgaWYgKGV4Y2x1ZGVkLmluZGV4T2Yoa2V5KSA+PSAwKSBjb250aW51ZTtcbiAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZTsiLCJmdW5jdGlvbiBfdHlwZW9mKG9iaikge1xuICBcIkBiYWJlbC9oZWxwZXJzIC0gdHlwZW9mXCI7XG5cbiAgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHtcbiAgICAgIHJldHVybiB0eXBlb2Ygb2JqO1xuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHtcbiAgICAgIHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gX3R5cGVvZihvYmopO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF90eXBlb2Y7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibG9kYXNoXCIpOzsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJuZXh0L2Rpc3QvbmV4dC1zZXJ2ZXIvbGliL2hlYWQuanNcIik7OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm5leHQvZGlzdC9uZXh0LXNlcnZlci9saWIvcm91dGVyLWNvbnRleHQuanNcIik7OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm5leHQvZGlzdC9uZXh0LXNlcnZlci9saWIvcm91dGVyL3V0aWxzL2dldC1hc3NldC1wYXRoLWZyb20tcm91dGUuanNcIik7OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm5leHQvZGlzdC9uZXh0LXNlcnZlci9saWIvdG8tYmFzZS02NC5qc1wiKTs7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibmV4dC9kaXN0L25leHQtc2VydmVyL3NlcnZlci9pbWFnZS1jb25maWcuanNcIik7OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm5leHQvcm91dGVyXCIpOzsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJuZXh0anMtYnJlYWRjcnVtYnNcIik7OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInByb3AtdHlwZXNcIik7OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlYWN0XCIpOzsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWFjdC1pc1wiKTs7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVhY3QtbG9hZGluZ1wiKTs7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVhY3QtcXVlcnlcIik7OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlYWN0L2pzeC1kZXYtcnVudGltZVwiKTs7IiwiLyogKGlnbm9yZWQpICovIl0sInNvdXJjZVJvb3QiOiIifQ==