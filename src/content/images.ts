// Every raster image used by the site, with alt text (DESIGN.md §6.2, §8.7 #31).
// Sizes are the optimised WebP dimensions, used to reserve space and avoid layout shift.
import type { ImageAsset } from './types';

import avatar from '../assets/img/avatar.webp';
import climateClassChildren from '../assets/img/climate-class-children.webp';
import climateSubcard from '../assets/img/climate-subcard.webp';
import climateZonesMap from '../assets/img/climate-zones-map.webp';
import co2Graph from '../assets/img/co2-graph.webp';
import earthquake from '../assets/img/earthquake.webp';
import elNinoLaNina from '../assets/img/el-nino-la-nina.webp';
import emissionsInfographic from '../assets/img/emissions-infographic.webp';
import farming2 from '../assets/img/farming-2.webp';
import heroBeachClass from '../assets/img/hero-beach-class.webp';
import iceAgeMammoths from '../assets/img/ice-age-mammoths.webp';
import levelProgress from '../assets/img/level-progress.webp';
import newsArticle from '../assets/img/news-article.webp';
import pdfIcon from '../assets/img/pdf-icon.webp';
import ringOfFireMap from '../assets/img/ring-of-fire-map.webp';
import temperatureGraph from '../assets/img/temperature-graph.webp';
import temperatureMillionsYears from '../assets/img/temperature-millions-years.webp';
import themeClimateChangeBromo from '../assets/img/theme-climate-change-bromo.webp';
import themeClimate from '../assets/img/theme-climate.webp';
import themeHumanNature from '../assets/img/theme-human-nature.webp';
import themeSolutionsFarming from '../assets/img/theme-solutions-farming.webp';
import thumb from '../assets/img/thumb.webp';
import volcano from '../assets/img/volcano.webp';
import warmAgeDinosaurs from '../assets/img/warm-age-dinosaurs.webp';
import weatherVsClimate from '../assets/img/weather-vs-climate.webp';

const img = (src: string, alt: string, width: number, height: number): ImageAsset => ({
  src,
  alt,
  width,
  height,
});

export const IMAGES = {
  heroBeachClass: img(heroBeachClass, '', 2048, 1536), // decorative hero background
  themeClimate: img(themeClimate, 'People walking on a sunny beach beside a turquoise sea', 1200, 1600),
  themeClimateChange: img(
    themeClimateChangeBromo,
    'Mount Bromo volcano rising above a sea of morning mist',
    1200,
    1600,
  ),
  themeHumanNature: img(themeHumanNature, 'People gathering food on a rocky tidal flat at low tide', 1600, 1200),
  themeSolutions: img(themeSolutionsFarming, 'Green rice terraces seen through the trees', 1200, 1600),
  farming2: img(farming2, 'Green rice terraces seen through the trees', 2400, 3200),
  climateSubcard: img(climateSubcard, 'An icy polar landscape next to a hot sandy desert', 1600, 1067),
  climateClassChildren: img(climateClassChildren, 'A class of smiling primary school children', 1600, 1200),
  newsArticle: img(
    newsArticle,
    'News headline: "2026 Drought Map and Clean Water Crisis Ahead of Peak Dry Season"',
    783,
    660,
  ),
  weatherVsClimate: img(
    weatherVsClimate,
    'Infographic comparing weather, which changes daily, with climate, the long-term average pattern',
    1600,
    920,
  ),
  climateZonesMap: img(
    climateZonesMap,
    'World map coloured by climate zone, from equatorial to polar',
    1600,
    1066,
  ),
  elNinoLaNina: img(
    elNinoLaNina,
    'Diagram of Pacific Ocean winds and warm water during El Niño and La Niña',
    683,
    521,
  ),
  ringOfFireMap: img(
    ringOfFireMap,
    'Map of the Pacific Ring of Fire showing volcanoes and tectonic plate boundaries around the Pacific Ocean',
    960,
    512,
  ),
  earthquake: img(
    earthquake,
    'Diagram of an earthquake: tectonic plates moving along a fault, with seismic waves spreading out from the hypocentre and epicentre',
    1000,
    715,
  ),
  volcano: img(
    volcano,
    'Cross-section of a volcano at a subduction zone: oceanic crust sinks under continental crust and magma rises to an eruption cloud',
    700,
    525,
  ),
  pdfIcon: img(pdfIcon, '', 400, 492), // decorative next to "Download the module" text
  thumb: img(thumb, '', 200, 200), // icon inside labelled buttons
  emissionsInfographic: img(
    emissionsInfographic,
    // NOTE: the chart's own labels are in Dutch (flagged to the team).
    'Pie chart of greenhouse gas emissions by sector: industry 28%, transport 23%, heating buildings 19%, electricity production 18%, agriculture 10%, waste 1%, other 1%',
    966,
    572,
  ),
  iceAgeMammoths: img(iceAgeMammoths, 'Illustration of woolly mammoths in an ice-age landscape', 1300, 591),
  warmAgeDinosaurs: img(warmAgeDinosaurs, 'Illustration of dinosaurs in a warm, green prehistoric landscape', 850, 567),
  temperatureMillionsYears: img(
    temperatureMillionsYears,
    "Graph of Earth's average temperature over millions of years, showing repeated warm and cold periods",
    720,
    242,
  ),
  co2Graph: img(co2Graph, 'Graph of atmospheric CO₂ levels rising sharply in recent centuries (NASA)', 720, 237),
  temperatureGraph: img(
    temperatureGraph,
    'Graph of global temperature change rising since 1880 (NASA)',
    1200,
    750,
  ),
  avatar: img(avatar, '', 512, 512), // decorative default avatar
  levelProgress: img(
    levelProgress,
    'Learner levels in order: Climate Beginner, Climate Curious, Climate Enthusiast, Climate Scholar, Climate Visionary and Climate Expert',
    1189,
    357,
  ),
} satisfies Record<string, ImageAsset>;
