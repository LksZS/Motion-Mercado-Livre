import path from "path";
import {Config} from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setChromiumOpenGlRenderer("angle");
Config.setBrowserExecutable(path.resolve(process.cwd(), "bin/chromium"));
