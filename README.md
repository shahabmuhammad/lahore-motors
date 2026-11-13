# Lahore Motors

A responsive Next.js and TypeScript dealership demo built with Tailwind CSS. It includes a Toyota model showcase, indicative price/WHT estimates, a fuel-cost calculator, sample order tracking, the MetaMod Toyota Support Agent widget, and a simulated two-step booking enquiry. The site exports as static files for GitHub Pages.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Demo behavior and production work

- The 2026 vehicle prices, withholding-tax rates, fuel economy, and fuel prices are illustrative estimates. Confirm current prices, tax rules, specifications, and fuel costs with the dealership before relying on them.
- Sample tracker records are available for `LM-26-0418`, `LM-26-0832`, and `LM-26-1027`. The demo CNIC `00000-0000000-0` also resolves to a sample record. No live dealer, plant, or customer-order system is connected.
- Booking enquiries return a simulated purchase reference. Name, CNIC, and phone are validated in the browser and never leave the browser; no customer details or bookings are persisted. Generated references only exist in the current page session.
- The embedded chat widget loads from MetaMod's staging host. For local development, set `NEXT_PUBLIC_METAMOD_EMBED_KEY` in `.env.local`; for GitHub Pages, add a repository Actions secret named `METAMOD_EMBED_KEY`. The key is included in the public page because the browser widget needs it, so use an embed key intended for client-side use and restrict it to the published site in MetaMod if supported.
- Before production, switch the widget to MetaMod's production host if available, connect a secure order-management service, confirm all commercial/tax information, and provide appropriate privacy disclosures.
- Lahore Motors is presented as an independent dealership concept and is not affiliated with or endorsed by Toyota or Indus Motor Company.

## GitHub Pages deployment

The workflow in `.github/workflows/deploy.yml` builds and deploys the static export when changes are pushed to `main` or `master`. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**. The build automatically applies the repository subpath for project pages.
