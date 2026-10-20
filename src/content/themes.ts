// The four learning themes (DESIGN.md §5.3–5.6, template from §8.3 #11).
// Copy is taken from Figma with the §8.4 #18 typo fixes. Indonesian and Dutch draft
// passages are translated into English (§8.4 #16); internal notes became placeholders.
import { IMAGES } from './images';
import { PH_INTRO, PH_PARAGRAPH, PH_SHORT, PH_IMAGE } from './placeholders';
import type { Theme, ThemeSlug } from './types';

const climate: Theme = {
  slug: 'climate',
  number: 1,
  title: 'Climate',
  subtitle: PH_INTRO,
  hero: IMAGES.themeClimate,
  cardImage: IMAGES.themeClimate,
  cardText: PH_SHORT,
  subCards: [
    {
      title: 'Learn about different climates',
      text: PH_SHORT,
      href: '#different-climates',
      image: IMAGES.climateSubcard,
    },
    {
      title: 'Climate lesson module',
      text: 'Open the lesson plan for this theme.',
      href: '/resources/lesson-plan-climate',
      image: IMAGES.climateClassChildren,
      climateClass: true,
    },
    {
      title: 'News article',
      text: 'Read about the 2026 drought and clean-water crisis.',
      href: '/resources?type=extra&theme=climate',
      image: IMAGES.newsArticle,
    },
  ],
  sections: [
    {
      id: 'weather-vs-climate',
      title: 'Weather vs. climate',
      layout: 'split',
      main: [
        {
          type: 'text',
          // Translated from the Indonesian draft in Figma.
          paragraphs: [
            'Weather is always around us. It can be rainy, hot, sunny or windy. Climate is the average pattern of weather in a place over a long period of time.',
            'So: weather changes from day to day. Climate is the pattern that forms over many years.',
          ],
        },
      ],
      aside: [{ type: 'image', image: IMAGES.weatherVsClimate }],
    },
    {
      id: 'different-climates',
      title: 'Different climates',
      layout: 'split',
      main: [
        {
          type: 'list',
          intro: 'Today, climate scientists split the Earth into about seven main types of climate. They are:',
          items: [
            'Equatorial: hot and rainy all year. Located right at the centre of the Earth, this zone has no seasons — just endless summer and thick rainforests.',
            'Subequatorial: hot, with long rainy seasons and a short dry season. It sits just outside the equator and is a transition zone.',
            'Tropical: hot, with distinct wet and dry seasons. It gets less rain overall than the equator, with open grasslands (savannas) and monsoon seasons.',
            'Subtropical: long, hot summers and short, mild winters. This zone is the bridge between the hot tropics and the cooler mid-latitudes.',
            'Temperate: four distinct seasons (spring, summer, autumn, winter), with moderate temperatures and regular rainfall throughout the year.',
            'Subpolar: short, cool summers and long, freezing winters. It is dominated by huge evergreen forests (taiga) and has deep winter snow.',
            'Polar: freezing cold all year round. Located at the top and bottom of the world, this zone is covered in ice, snow and frozen ground (tundra), with hardly any rain.',
          ],
        },
      ],
      aside: [{ type: 'image', image: IMAGES.climateZonesMap, caption: 'Climate zones of the world' }],
    },
    {
      id: 'el-nino-la-nina',
      title: 'El Niño and La Niña',
      layout: 'split',
      align: 'right',
      main: [
        {
          type: 'text',
          paragraphs: [
            'Normally, strong winds blow from east to west across the Pacific Ocean, pushing warm surface water towards Indonesia. This creates a huge pool of warm water and heavy rain clouds over the Indonesian archipelago. Every 3 to 7 years these trade winds weaken or strengthen, flipping the temperature balance in the Pacific and changing where rain clouds form.',
            'During El Niño, the trade winds weaken. Warm water in the central and eastern Pacific moves eastwards, away from Indonesia. Indonesia gets a drier, longer dry season with much less rain. There is a higher risk of drought and of forest and land fires.',
            'During La Niña, the trade winds become much stronger than usual. They push even more warm surface water into Indonesian waters, while cold water rises near South America. Indonesia gets heavier rain than normal, and more floods and landslides.',
          ],
        },
      ],
      aside: [
        {
          type: 'image',
          image: IMAGES.elNinoLaNina,
          caption: 'Winds and ocean temperatures in the Pacific during La Niña and El Niño',
        },
      ],
    },
    {
      id: 'ring-of-fire',
      title: 'The Ring of Fire',
      layout: 'stack',
      align: 'center',
      main: [
        { type: 'image', image: IMAGES.ringOfFireMap },
        {
          type: 'split',
          left: [
            {
              type: 'text',
              paragraphs: [
                'The Ring of Fire is a huge, horseshoe-shaped path around the Pacific Ocean with many active volcanoes and frequent earthquakes. Because Indonesia sits where several tectonic plates meet inside this zone, it is one of the most geologically active countries on Earth.',
                'Indonesia is home to more than 120 active volcanoes — more than almost any other country. The moving plates regularly cause earthquakes. Large earthquakes under the sea can push huge amounts of water and create devastating tsunamis, such as the 2004 Indian Ocean tsunami.',
              ],
            },
          ],
          right: [
            {
              type: 'circles',
              items: [
                { label: 'Earthquakes', image: IMAGES.earthquake },
                { label: 'Volcanoes', image: IMAGES.volcano },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'atmosphere',
      title: 'Atmosphere',
      layout: 'stack',
      main: [
        { type: 'text', paragraphs: [PH_PARAGRAPH] },
        { type: 'placeholder', label: PH_IMAGE, ratio: '1002 / 355' },
      ],
    },
  ],
};

const climateChange: Theme = {
  slug: 'climate-change',
  number: 2,
  title: 'Climate Change',
  subtitle: PH_INTRO,
  hero: IMAGES.themeClimateChange,
  cardImage: IMAGES.themeClimateChange,
  cardText: PH_SHORT,
  testSlug: 'test-climate-change',
  subCards: [
    { title: 'How the atmosphere works', text: PH_SHORT, href: '#what-is-happening' },
    { title: 'Lesson module', text: PH_SHORT, href: '/resources?type=lesson-plan&theme=climate-change' },
    { title: 'News', text: PH_SHORT, href: '/resources?type=extra&theme=climate-change' },
  ],
  sections: [
    {
      id: 'ice-age-warm-age',
      title: 'Ice age and warm age',
      layout: 'stack',
      main: [
        {
          type: 'split',
          left: [
            {
              type: 'text',
              paragraphs: [
                "Earth's temperature has always changed over thousands of years, switching between ice ages and warm ages.",
                PH_PARAGRAPH,
              ],
            },
          ],
          right: [
            {
              type: 'circles',
              items: [
                { label: 'Ice age: mammoths', image: IMAGES.iceAgeMammoths },
                { label: 'Warm age: dinosaurs', image: IMAGES.warmAgeDinosaurs },
              ],
            },
          ],
        },
        {
          type: 'image',
          image: IMAGES.temperatureMillionsYears,
          caption: 'Changing temperatures over millions of years',
        },
      ],
    },
    {
      id: 'what-is-happening',
      title: 'Climate change: what is happening?',
      navLabel: 'Accelerated global warming',
      layout: 'split',
      main: [
        {
          type: 'list',
          intro:
            'Global warming is speeding up. Rising levels of CO₂ and methane cause more heat to be trapped in the atmosphere. Compare the two graphs:',
          items: ['CO₂ levels over the last few hundred years', 'The rise in temperature in degrees Celsius'],
        },
        {
          type: 'text',
          paragraphs: ['You can see that higher CO₂ levels go together with higher temperatures.'],
        },
      ],
      aside: [
        { type: 'image', image: IMAGES.co2Graph, caption: 'Atmospheric CO₂. Source: NASA' },
        { type: 'image', image: IMAGES.temperatureGraph, caption: 'Global temperature change. Source: NASA' },
      ],
    },
    {
      id: 'who-is-responsible',
      title: 'Who is responsible for climate change?',
      layout: 'stack',
      main: [
        {
          type: 'split',
          left: [{ type: 'image', image: IMAGES.emissionsInfographic, caption: 'Greenhouse gas emissions per sector' }],
          right: [
            {
              type: 'text',
              paragraphs: [
                'Human activity! There is an imbalance between the Earth and the way people use its resources: we take too much, and we release too much CO₂.',
              ],
            },
          ],
        },
        {
          type: 'circles',
          items: [
            { label: 'Industry', text: PH_SHORT },
            { label: 'Livestock', text: PH_SHORT },
            { label: 'Food production', text: PH_SHORT },
            { label: 'Waste', text: PH_SHORT },
          ],
        },
        { type: 'chip', label: 'Countries vs. citizens' },
        { type: 'text', paragraphs: [PH_PARAGRAPH] },
      ],
    },
    {
      id: 'consequences',
      title: 'What are the consequences?',
      layout: 'stack',
      main: [
        {
          type: 'list',
          intro: 'So the temperature rises — but what happens next?',
          items: [
            'Animals and plants cannot adapt or migrate fast enough',
            { text: 'Ocean acidification', children: ['Coral dies', 'Fish die'] },
            { text: 'Ice melts and the sea level rises', children: ['Coastal erosion'] },
            'More extreme weather',
          ],
        },
      ],
    },
  ],
};

const humanAndNature: Theme = {
  slug: 'human-and-nature',
  number: 3,
  title: 'Human and Nature',
  subtitle: PH_INTRO,
  hero: IMAGES.themeHumanNature,
  cardImage: IMAGES.themeHumanNature,
  cardText: PH_SHORT,
  subCards: [
    { title: 'Mangroves', text: PH_SHORT, href: '#natures-impact' },
    { title: 'Lesson module', text: PH_SHORT, href: '/resources?type=lesson-plan&theme=human-and-nature' },
    { title: 'News', text: PH_SHORT, href: '/resources?type=extra&theme=human-and-nature' },
  ],
  sections: [
    {
      id: 'human-and-nature',
      title: 'Human and nature',
      layout: 'split',
      main: [
        {
          type: 'text',
          // Translated from the Dutch draft in Figma.
          paragraphs: [
            'People are part of nature. We need clean air, water and food, and nature provides them. But climate change is upsetting that balance. What does that mean for animals, for plants — and for us?',
          ],
        },
      ],
      aside: [{ type: 'placeholder', label: PH_IMAGE, ratio: '652 / 229' }],
    },
    {
      id: 'human-impact',
      title: 'Human impact on nature',
      layout: 'stack',
      main: [
        { type: 'text', paragraphs: ['We have a big impact on nature.', PH_PARAGRAPH] },
        {
          type: 'tiles',
          items: [
            { title: 'Deforestation', text: PH_SHORT },
            { title: 'Farming and pollution', text: PH_SHORT },
          ],
        },
      ],
    },
    {
      id: 'natures-impact',
      title: "Nature's impact on humans",
      layout: 'stack',
      main: [
        {
          type: 'text',
          paragraphs: [
            'Nature gives us food, and it also makes life possible: natural barriers protect our coasts, and plants capture CO₂ and make the oxygen we breathe.',
          ],
        },
        {
          type: 'circles',
          items: [
            { label: 'Mangroves', text: PH_SHORT },
            { label: 'Coral reefs', text: PH_SHORT },
            { label: 'Ocean forests: CO₂ capture', text: PH_SHORT },
          ],
        },
      ],
    },
    {
      id: 'consequences-nature',
      title: 'Consequences for nature',
      layout: 'stack',
      main: [
        {
          type: 'text',
          paragraphs: ['When it gets too hot too quickly, animals and plants cannot adjust. What is happening to nature?'],
        },
        {
          type: 'circles',
          items: [
            {
              label: 'Extinction',
              text: 'Animals and plants cannot adjust this fast. Between ice ages and warm periods, species normally had thousands of years to adapt or slowly migrate.',
            },
            {
              label: 'Coral dying',
              text: 'Coral dies when sea water gets too warm. At 2 °C of warming, almost all coral reefs (about 99%) could be lost.',
            },
            {
              label: 'Ice melting',
              text: 'Melting ice caps raise the sea level, release CO₂ and methane, and remove a bright surface that reflects sunlight. Ice is also home to many species.',
            },
            { label: 'Ocean acidification', text: 'There is less oxygen in the water, and fish species are dying.' },
          ],
        },
      ],
    },
    {
      id: 'consequences-humans',
      title: 'Consequences for humans',
      layout: 'stack',
      main: [
        {
          type: 'text',
          paragraphs: [
            'Fewer animals means less food and fewer resources for people. Less coral means less protection for our coasts. More extreme weather means less security for the places where people live.',
          ],
        },
        {
          type: 'circles',
          items: [
            { label: 'Rising sea level', text: PH_SHORT },
            { label: 'Heat waves', text: PH_SHORT },
            { label: 'Droughts', text: PH_SHORT },
            { label: 'Flooding', text: PH_SHORT },
          ],
        },
        {
          type: 'tiles',
          items: [
            { title: 'News: weather in Lombok', text: PH_SHORT },
            { title: 'News from elsewhere', text: PH_SHORT },
          ],
        },
      ],
    },
    {
      id: 'tipping-points',
      title: 'Tipping points',
      layout: 'split',
      main: [
        {
          type: 'text',
          // Translated from the Dutch draft in Figma.
          paragraphs: [
            'Sometimes an ecosystem cannot go back after a certain point. An Amazon rainforest that has dried out, or a coral reef that has died, does not simply recover. We call this a tipping point: a limit after which the change can no longer be stopped.',
          ],
        },
      ],
      aside: [{ type: 'circles', items: [{ label: 'Amazon rainforest' }, { label: 'Coral reefs' }] }],
    },
  ],
};

const solutions: Theme = {
  slug: 'solutions',
  number: 4,
  title: 'Solutions',
  subtitle: PH_INTRO,
  hero: IMAGES.farming2,
  cardImage: IMAGES.themeSolutions,
  cardText: PH_SHORT,
  subCards: [
    { title: 'What can you do?', text: PH_SHORT, href: '#what-can-you-do' },
    { title: 'Lesson module', text: PH_SHORT, href: '/resources?type=lesson-plan&theme=solutions' },
    { title: 'News', text: PH_SHORT, href: '/resources?type=extra&theme=solutions' },
  ],
  sections: [
    {
      id: 'mitigation-adaptation',
      title: 'Mitigation and adaptation',
      layout: 'stack',
      main: [
        {
          type: 'text',
          paragraphs: [
            'There are two ways to respond to climate change. Mitigation means tackling the causes, so the climate changes less. Adaptation means adjusting to the changes that are already happening.',
          ],
        },
        {
          type: 'tiles',
          items: [
            { title: 'Mitigation: renewable energy', text: PH_SHORT },
            { title: 'Mitigation: stopping deforestation', text: PH_SHORT },
            { title: 'Adaptation: planting mangroves', text: PH_SHORT },
            { title: 'Adaptation: drought-resistant crops', text: PH_SHORT },
          ],
        },
      ],
    },
    {
      id: 'protect-first',
      title: 'Protect first, then restore',
      layout: 'split',
      main: [
        {
          type: 'text',
          paragraphs: ['It takes a long time for nature to recover, so protecting it is better than restoring it.'],
        },
      ],
      aside: [{ type: 'placeholder', label: 'Image: deforestation', ratio: '651 / 250' }],
    },
    {
      id: 'renewable-energy',
      title: 'Renewable energy',
      layout: 'stack',
      main: [
        {
          type: 'circles',
          items: [
            { label: 'Solar', text: PH_SHORT },
            { label: 'Wind', text: PH_SHORT },
            { label: 'Water', text: PH_SHORT },
          ],
        },
      ],
    },
    {
      id: 'food',
      title: 'Food',
      layout: 'stack',
      main: [
        {
          type: 'tiles',
          items: [
            { title: 'Monoculture', text: PH_SHORT },
            { title: 'Permaculture', text: PH_SHORT },
          ],
        },
        {
          type: 'circles',
          items: [
            { label: 'Diet with meat' },
            { label: 'Diet without meat' },
            { label: 'Food waste' },
            { label: 'Preserving food' },
          ],
        },
        {
          type: 'split',
          left: [
            {
              type: 'text',
              paragraphs: [
                'Animals produce a lot of greenhouse gases, so eating fewer animal products means less CO₂ in the food chain. Eating less meat can be healthier too.',
              ],
            },
          ],
          right: [{ type: 'text', paragraphs: ['Saving food is a good way to reduce your carbon footprint.'] }],
        },
      ],
    },
    {
      id: 'reduce-reuse-recycle',
      title: 'Reduce, reuse and recycle',
      layout: 'stack',
      main: [
        {
          type: 'text',
          paragraphs: [
            'Indonesia is one of the biggest producers of plastic waste in the world, so there is a lot to gain here. There are different types of waste: organic waste, glass, paper, chemical waste and plastic.',
          ],
        },
        {
          type: 'circles',
          items: [
            { label: 'Reduce', text: PH_SHORT },
            { label: 'Reuse', text: PH_SHORT },
            { label: 'Recycle', text: PH_SHORT },
          ],
        },
        { type: 'chip', label: 'The current system' },
        {
          type: 'tiles',
          items: [
            { title: 'Burning plastic: side effects', text: PH_SHORT },
            { title: 'Throwing plastic on the ground: side effects', text: PH_SHORT },
          ],
        },
        {
          type: 'circles',
          items: [
            { label: 'Reduce plastic by…', text: PH_SHORT },
            { label: 'Reuse plastic by…', text: PH_SHORT },
            { label: 'Recycle plastic through…', text: PH_SHORT },
          ],
        },
      ],
    },
    {
      id: 'what-can-you-do',
      title: 'What can you do?',
      layout: 'stack',
      main: [
        {
          type: 'tiles',
          items: [
            'LED lights',
            'Scooter share',
            'Eat less meat',
            'Eat leftovers',
            "Don't use straws",
            'Raise awareness',
            'Reusable water bottle',
            'Use Ecosia as your search engine',
            'Use fewer napkins',
            'Turn off the lights',
            'Eat in instead of takeaway',
            'Wrap food in banana leaves',
          ].map((title) => ({ title, text: PH_SHORT })),
        },
      ],
    },
    {
      id: 'governments',
      title: 'What are governments doing?',
      layout: 'stack',
      main: [
        {
          type: 'split',
          left: [
            { type: 'text', paragraphs: ['Paris Agreement (COP21)', PH_PARAGRAPH] },
            {
              type: 'links',
              items: [{ label: 'Check progress: Climate Action Tracker', href: 'https://climateactiontracker.org/' }],
            },
          ],
          right: [
            { type: 'text', paragraphs: ["Indonesia's targets", PH_PARAGRAPH] },
            {
              type: 'links',
              items: [
                {
                  label: 'Check progress: Climate Action Tracker, Indonesia',
                  href: 'https://climateactiontracker.org/countries/indonesia/',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const THEMES: Theme[] = [climate, climateChange, humanAndNature, solutions];

export const getTheme = (slug: string | undefined): Theme | undefined =>
  THEMES.find((theme) => theme.slug === slug);

export const THEME_TITLES: Record<ThemeSlug, string> = Object.fromEntries(
  THEMES.map((t) => [t.slug, t.title]),
) as Record<ThemeSlug, string>;
