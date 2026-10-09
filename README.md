![Project screenshot](./screenshot.png)

# Little Green: Plant Care Calendar

Little Green is a small houseplant collection and watering tracker. It keeps each plant name, room, light preference, and watering interval in view.

**GitHub Pages URL:** https://a2rp.github.io/plant-care-calendar/ (available after deployment)

## Included

- Add a plant with its room, watering interval, and light preference.
- See which plants are due for water based on the last recorded watering date.
- Filter the collection to plants that need water or are doing fine.
- Record Watered today to reset the estimate.
- Remove plants with a confirmation dialog.

## How to use it

Add a plant and set a rough watering interval. Check Needs water to see plants past their interval, then record watering after checking the soil. Use search to find a plant by name, species, or room.

## Data and limits

Plant records are kept in localStorage in this browser. Watering intervals are estimates only; check the soil and account for plant conditions.

This is a browser-only utility. Clearing the browser’s site data removes its saved information.

## Run locally

~~~sh
npm install
npm run dev
~~~

## Checks and deployment

~~~sh
npm run lint
npm run build
npm run deploy
~~~

The deploy command builds the project and publishes the dist directory to the gh-pages branch. It requires the project’s public GitHub repository to be configured as origin.

## Future improvements

Ideas only. These are not implemented yet:

- Add a calendar view with scheduled care days.
- Track fertilizing and repotting alongside watering.
- Add plant photos and seasonal notes.

## Links

- Portfolio: [https://www.ashishranjan.net](https://www.ashishranjan.net)
- GitHub: [https://github.com/a2rp](https://github.com/a2rp)
- CodePen: [https://codepen.io/ash1198](https://codepen.io/ash1198)
- LinkedIn: [https://www.linkedin.com/in/aashishranjan](https://www.linkedin.com/in/aashishranjan)
- Facebook: [https://www.facebook.com/theash.ashish/](https://www.facebook.com/theash.ashish/)
- YouTube: [https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1](https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1)
- Email: [mailto:ash.ranjan09@gmail.com](mailto:ash.ranjan09@gmail.com)

## Support

- Support: [https://a2rp-donation-page.netlify.app/](https://a2rp-donation-page.netlify.app/)
- Buy Me a Coffee: [https://buymeacoffee.com/ashishranjan](https://buymeacoffee.com/ashishranjan)
- Patreon: [https://www.patreon.com/ashishranjan](https://www.patreon.com/ashishranjan)