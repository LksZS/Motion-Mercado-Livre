import {Config} from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setChromiumOpenGlRenderer("angle");
Config.setBrowserExecutable("/usr/local/bin/chromium");
