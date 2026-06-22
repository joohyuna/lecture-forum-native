// /metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// 지금 현재 프로젝트에서는 zustand가 끌고 들어오는 라이브러리를 중에 하나가 문제를 발생시키고 있음
// 우리는 react-native 환경이기 때문에 환경변수를 불러올 때 import.meta 를 쓰지 않는데,
// 코드 상에 포함되어 있어서 문제를 일으킴

// react-native나 react는 브라우저 환경 또는 앱 환경 안에서 프로그램이 계속적으로 살아있어야 함
// 하지만 문제가 발생되면 프로그램 자체가 죽어버림
config.resolver.unstable_enablePackageExports = false;
module.exports = withNativeWind(config, { input: "./styles/global.css" });
