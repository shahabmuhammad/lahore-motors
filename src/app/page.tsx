"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  FilerStatus,
  formatPkr,
  getDemoOrder,
  getOrderPayment,
  getWhtRate,
  vehicles,
} from "@/lib/vehicles";

type Order = {
  poNumber: string;
  variant: string;
  color: string;
  paymentType: string;
  paidPercentage: number;
  balanceDue: number;
  branch: string;
  status: string;
  deliveryDate: string;
  vehiclePrice: number;
  isDemo?: boolean;
  notice?: string;
};

const deliveryStages = [
  "Order Booked",
  "Under Assembly at IMC Plant",
  "In Transit",
  "Ready at Dealership",
  "Delivered to Customer",
];

const quickQuestions = [
  "Compare fuel costs",
  "Current prices",
  "Financing options",
  "Track an order",
];

function Icon({
  name,
  size = 20,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const paths: Record<string, React.ReactNode> = {
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    fuel: (
      <>
        <path d="M3 22h12M5 22V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v17" />
        <path d="M5 8h8m2 3h2l2 2v5a2 2 0 0 1-4 0v-3h-2" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    location: (
      <>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    chat: (
      <>
        <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
      </>
    ),
    close: <path d="m18 6-12 12M6 6l12 12" />,
    send: (
      <>
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    car: (
      <>
        <path d="m5 11 1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11" />
        <path d="M3 11h18v7H3zM5 18v2m14-2v2M6 14h.01M18 14h.01" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    spark: (
      <>
        <path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" />
        <path d="m19 14 1.3 2.7L23 18l-2.7 1.3L19 22l-1.3-2.7L15 18l2.7-1.3L19 14Z" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name] ?? paths.spark}
    </svg>
  );
}

function formatCompact(amount: number) {
  return new Intl.NumberFormat("en-PK", {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

function formatCostPerKm(amount: number) {
  return `PKR ${new Intl.NumberFormat("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`;
}

function OrderCard({ order }: { order: Order }) {
  const stageIndex = deliveryStages.indexOf(order.status);
  return (
    <div className="order-result" aria-live="polite">
      <div className="order-result-top">
        <div>
          <span className="micro-label">PURCHASE ORDER</span>
          <strong className="order-number">{order.poNumber}</strong>
        </div>
        <span className="demo-pill">DEMO RECORD</span>
      </div>
      <div className="order-specs">
        <div>
          <span>Vehicle</span>
          <strong>{order.variant}</strong>
        </div>
        <div>
          <span>Colour</span>
          <strong>{order.color}</strong>
        </div>
        <div>
          <span>Payment</span>
          <strong>{order.paymentType}</strong>
        </div>
        <div>
          <span>Paid so far</span>
          <strong>{order.paidPercentage}%</strong>
        </div>
        <div>
          <span>Balance due</span>
          <strong>{formatPkr(order.balanceDue)}</strong>
        </div>
        <div>
          <span>Dealership</span>
          <strong>{order.branch}</strong>
        </div>
      </div>
      <div className="delivery-progress">
        <div className="delivery-progress-heading">
          <div>
            <span className="micro-label">DELIVERY STATUS</span>
            <strong>{order.status}</strong>
          </div>
          <span className="delivery-date">{order.deliveryDate}</span>
        </div>
        <div
          className="stage-track"
          aria-label={`Delivery stage: ${order.status}`}
        >
          {deliveryStages.map((stage, index) => (
            <span
              key={stage}
              className={`stage-dot ${index <= stageIndex ? "stage-dot-active" : ""} ${index === stageIndex ? "stage-dot-current" : ""}`}
              title={stage}
            />
          ))}
        </div>
        <div className="stage-labels">
          <span>Booked</span>
          <span>At plant</span>
          <span>In transit</span>
          <span>Dealership</span>
          <span>Delivered</span>
        </div>
      </div>
      {order.notice && <p className="order-note">{order.notice}</p>}
      {order.isDemo && (
        <p className="order-note">
          Sample status for demonstration only. Contact Lahore Motors to verify
          an actual order.
        </p>
      )}
    </div>
  );
}

export default function Home() {
  const [filerStatus, setFilerStatus] = useState<FilerStatus>("filer");
  const [monthlyDistance, setMonthlyDistance] = useState(1200);
  const [petrolPrice, setPetrolPrice] = useState(272);
  const [dieselPrice, setDieselPrice] = useState(285);
  const [lookup, setLookup] = useState("");
  const [lookupType, setLookupType] = useState<"po" | "cnic">("po");
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [trackingError, setTrackingError] = useState("");
  const [bookingStep, setBookingStep] = useState(1);
  const [booking, setBooking] = useState({
    name: "",
    cnic: "",
    phone: "",
    city: "Lahore",
    filerStatus: "filer",
    vehicleId: "corolla",
    paymentType: "Half Payment",
  });
  const [bookingResult, setBookingResult] = useState<Order | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      text: "Welcome to Lahore Motors. I can help with Toyota specs, estimated running costs, pricing and financing. I’m a demo assistant, so please confirm current offers with our team.",
    },
  ]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const calculatorRows = useMemo(
    () =>
      vehicles.map((vehicle) => {
        const fuelPrice = vehicle.fuel === "petrol" ? petrolPrice : dieselPrice;
        const cityCost = fuelPrice / vehicle.cityKmPerLitre;
        const highwayCost = fuelPrice / vehicle.highwayKmPerLitre;
        const monthlyCost =
          monthlyDistance *
          (0.65 * cityCost + 0.35 * highwayCost);
        return {
          vehicle,
          fuelPrice,
          cityCost,
          highwayCost,
          monthlyCost,
          annualCost: monthlyCost * 12,
          fullTankCost: fuelPrice * vehicle.tankCapacity,
        };
      }),
    [dieselPrice, monthlyDistance, petrolPrice],
  );

  function findOrder(event?: FormEvent<HTMLFormElement>, value = lookup) {
    event?.preventDefault();
    const searchValue = value.trim();
    setTrackingError("");
    setTrackedOrder(null);
    if (!searchValue) {
      setTrackingError("Enter your PO number or CNIC to look up an order.");
      return;
    }

    const result = getDemoOrder(searchValue);
    if (result) {
      setTrackedOrder(result);
    } else {
      setTrackingError(
        "No demo order matched that detail. Check the number, or contact our team for a private order lookup.",
      );
    }
  }

  function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (bookingStep === 1) {
      setBookingStep(2);
      return;
    }

    const vehicle = vehicles.find((item) => item.id === booking.vehicleId);
    if (!vehicle) return;

    const payment = getOrderPayment(vehicle.price, booking.paymentType);
    setBookingResult({
      poNumber: `LM-26-${Math.floor(1000 + Math.random() * 9000)}`,
      variant: `${vehicle.name} ${vehicle.variant}`,
      color: "To be confirmed",
      paymentType: booking.paymentType,
      paidPercentage: payment.paidPercentage,
      balanceDue: payment.balanceDue,
      branch: `Lahore Motors · ${booking.city}`,
      status: "Order Booked",
      deliveryDate: "Delivery estimate confirmed by dealership",
      vehiclePrice: vehicle.price,
      isDemo: true,
      notice:
        "This is a simulated booking reference. Your personal details were not sent or saved.",
    });
  }

  function updateBooking(field: keyof typeof booking, value: string) {
    setBooking((current) => ({ ...current, [field]: value }));
  }

  function getAssistantReply(message: string) {
    const question = message.toLowerCase();
    if (question.includes("track") || question.includes("order")) {
      return "You can check a sample delivery status in the Order Tracker. Try demo PO LM-26-0418, LM-26-0832 or LM-26-1027. Real customer orders aren’t connected in this demo.";
    }
    if (
      question.includes("finance") ||
      question.includes("lease") ||
      question.includes("ijarah") ||
      question.includes("hbl")
    ) {
      return "Meezan Bank Ijarah and HBL auto financing are options customers commonly explore. Eligibility, rate, tenure and current campaigns vary by bank; please request a personalized quote from our finance desk.";
    }
    if (question.includes("fuel") || question.includes("economy")) {
      return "For the estimates shown here, Yaris returns about 12 km/L in city and 16 on highway, Corolla 10 and 14, and Fortuner diesel 8 and 11. These vary with traffic, driving style and maintenance. Try the running-cost calculator with your own fuel rate.";
    }
    if (
      question.includes("price") ||
      question.includes("cost") ||
      question.includes("wht")
    ) {
      return `Illustrative ex-factory estimates: Yaris ${formatPkr(vehicles[0].price)}, Corolla ${formatPkr(vehicles[1].price)}, Fortuner ${formatPkr(vehicles[2].price)}. Withholding tax depends on engine size and filer status. See the price cards for the estimated breakdown; confirm today's price with the dealership.`;
    }
    const vehicle = vehicles.find((item) =>
      question.includes(item.name.toLowerCase()),
    );
    if (vehicle) {
      return `${vehicle.name} ${vehicle.variant}: ${vehicle.engine}, ${vehicle.horsepower} hp, ${vehicle.torque} Nm and ${vehicle.transmission}. Estimated fuel economy is ${vehicle.cityKmPerLitre} km/L city and ${vehicle.highwayKmPerLitre} km/L highway.`;
    }
    return "I can help with Yaris, Corolla and Fortuner specifications, estimated prices, fuel costs, bank financing options and sample order tracking. What would you like to know?";
  }

  function sendChatMessage(message = chatInput) {
    const trimmed = message.trim();
    if (!trimmed) return;
    const reply = getAssistantReply(trimmed);
    setChatMessages((current) => [
      ...current,
      { role: "user", text: trimmed },
      { role: "assistant", text: reply },
    ]);
    setChatInput("");
  }

  const selectedBookingVehicle =
    vehicles.find((vehicle) => vehicle.id === booking.vehicleId) ?? vehicles[1];

  return (
    <main>
      <div className="topline">
        <span>
          <Icon name="location" size={14} /> Gulberg III, Lahore
        </span>
        <span className="topline-divider" />
        <span>Mon – Sat · 10:00 am – 8:00 pm</span>
        <a className="topline-phone" href="tel:+9242111222213">
          +92 42 111 222 213
        </a>
      </div>

      <header className="site-header">
        <a className="brand" href="#home" aria-label="Lahore Motors home">
          <span className="brand-monogram" aria-hidden="true">LM</span>
          <span className="brand-wordmark">
            <strong>LAHORE</strong>
            <span>MOTORS</span>
          </span>
        </a>
        <button
          className="mobile-menu-toggle"
          type="button"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <Icon name={mobileMenuOpen ? "close" : "menu"} />
        </button>
        <nav className={`main-nav ${mobileMenuOpen ? "main-nav-open" : ""}`}>
          <a href="#showroom" onClick={() => setMobileMenuOpen(false)}>
            Showroom
          </a>
          <a href="#calculator" onClick={() => setMobileMenuOpen(false)}>
            Running costs
          </a>
          <a href="#tracking" onClick={() => setMobileMenuOpen(false)}>
            Track order
          </a>
          <a
            href="#booking"
            className="nav-cta"
            onClick={() => setMobileMenuOpen(false)}
          >
            Book a Toyota <Icon name="arrow" size={17} />
          </a>
        </nav>
      </header>

      <section className="hero" id="home">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="eyebrow-line" />
            YOUR TOYOTA, YOUR WAY
          </span>
          <h1>
            Made for the
            <br />
            <span>long way home.</span>
          </h1>
          <p>
            Find the right Toyota for every road ahead. Thoughtful guidance,
            transparent estimates and a team that makes the journey feel easy.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#showroom">
              Explore the range <Icon name="arrow" size={18} />
            </a>
            <a className="text-link" href="#tracking">
              Already booked? Track order
            </a>
          </div>
          <div className="hero-footnote">
            <span className="hero-dot" />
            Your Toyota dealership in Lahore
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-image" role="img" aria-label="Dark sports sedan driving on a wet highway" />
          <div className="hero-image-shade" />
          <span className="hero-image-index">A BETTER DRIVE STARTS HERE</span>
          <div className="hero-image-caption">
            <span className="hero-caption-rule" />
            <div>
              <strong>Where will you go next?</strong>
              <span>Find a car that takes you there.</span>
            </div>
          </div>
          <div className="hero-image-orbit" aria-hidden="true">
            <span>DRIVE YOUR</span>
            <strong>OWN WAY</strong>
            <Icon name="arrow" size={18} />
          </div>
        </div>
        <div className="hero-bottom">
          <span>EST. LAHORE · PAKISTAN</span>
          <span>TOYOTA, WITH A LITTLE MORE HEART.</span>
        </div>
      </section>

      <section className="intro-strip" aria-label="Lahore Motors services">
        <div className="intro-item">
          <span className="intro-number">01</span>
          <div>
            <strong>Find your fit</strong>
            <span>Explore the Toyota range</span>
          </div>
        </div>
        <div className="intro-item">
          <span className="intro-number">02</span>
          <div>
            <strong>Know the numbers</strong>
            <span>Plan your running costs</span>
          </div>
        </div>
        <div className="intro-item">
          <span className="intro-number">03</span>
          <div>
            <strong>Drive with confidence</strong>
            <span>We’re here at every turn</span>
          </div>
        </div>
        <span className="intro-side-note">A LITTLE CLOSER TO THE ROAD AHEAD</span>
      </section>

      <section className="showroom section-pad" id="showroom">
        <div className="section-heading showroom-heading">
          <div>
            <span className="eyebrow">
              <span className="eyebrow-line" />
              THE LINE-UP
            </span>
            <h2>Find your kind of <em>drive.</em></h2>
            <p>Three distinctly different ways to make every day yours.</p>
          </div>
          <div className="filer-switch-wrap">
            <span className="filer-switch-label">YOUR TAX PROFILE</span>
            <div className="segmented-control" role="group" aria-label="Filer tax profile">
              {(["filer", "non-filer"] as const).map((value) => (
                <button
                  type="button"
                  key={value}
                  className={filerStatus === value ? "segment-active" : ""}
                  aria-pressed={filerStatus === value}
                  onClick={() => setFilerStatus(value)}
                >
                  {value === "filer" ? "Filer" : "Non-filer"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="vehicle-grid">
          {vehicles.map((vehicle, index) => {
            const rate = getWhtRate(vehicle, filerStatus);
            const tax = Math.round(vehicle.price * rate);
            return (
              <article className="vehicle-card" key={vehicle.id}>
                <div
                  className={`vehicle-image vehicle-image-${vehicle.id}`}
                  style={{ backgroundImage: `url("${vehicle.image}")`, backgroundColor: vehicle.accent }}
                  role="img"
                  aria-label={vehicle.imageAlt}
                >
                  <span className="vehicle-index">0{index + 1} / 03</span>
                  <span className="vehicle-category">{vehicle.category}</span>
                  <span className="vehicle-image-link">
                    <Icon name="arrow" size={18} />
                  </span>
                </div>
                <div className="vehicle-content">
                  <span className="vehicle-edition">THE LAHORE MOTORS SELECTION</span>
                  <h3>{vehicle.name}</h3>
                  <p className="vehicle-variant">{vehicle.variant}</p>
                  <div className="vehicle-highlights">
                    <span>
                      <strong>{vehicle.engine}</strong> Engine
                    </span>
                    <span>
                      <strong>{vehicle.horsepower} hp</strong> Power
                    </span>
                    <span>
                      <strong>{vehicle.transmission}</strong> Transmission
                    </span>
                    <span>
                      <strong>{vehicle.torque} Nm</strong> Torque
                    </span>
                  </div>
                  <div className="vehicle-spec-note">
                    <Icon name="shield" size={16} />
                    <span>{vehicle.safety}</span>
                    <span className="spec-separator">·</span>
                    <span>{vehicle.dimensions}</span>
                  </div>
                  <div className="vehicle-pricing">
                    <div className="price-line">
                      <span>Ex-factory estimate</span>
                      <strong>{formatPkr(vehicle.price)}</strong>
                    </div>
                    <div className="price-line price-line-sub">
                      <span>
                        WHT · {filerStatus === "filer" ? "Filer" : "Non-filer"}{" "}
                        ({(rate * 100).toFixed(1)}%)
                      </span>
                      <span>+ {formatPkr(tax)}</span>
                    </div>
                    <div className="price-line price-line-total">
                      <span>Estimated on-road*</span>
                      <strong>{formatPkr(vehicle.price + tax)}</strong>
                    </div>
                  </div>
                  <a
                    className="vehicle-cta"
                    href="#booking"
                    onClick={() =>
                      setBooking((current) => ({
                        ...current,
                        vehicleId: vehicle.id,
                      }))
                    }
                  >
                    Make it yours <Icon name="arrow" size={17} />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
        <div className="price-disclaimer">
          <Icon name="spark" size={16} />
          <span>
            *Illustrative 2026 estimates only. WHT rates are indicative and
            calculated on ex-factory price; freight, registration, insurance,
            accessories and applicable taxes can change the final amount.
            Please confirm current prices and tax treatment with Lahore Motors.
          </span>
        </div>
      </section>

      <section className="calculator-section section-pad" id="calculator">
        <div className="calculator-top">
          <div className="calculator-intro">
            <span className="eyebrow eyebrow-light">
              <span className="eyebrow-line" />
              PLAN THE ROAD AHEAD
            </span>
            <h2>Good drives.<br /><em>Clear numbers.</em></h2>
            <p>
              A quick estimate for your monthly drive. Adjust the distance and
              fuel rates to make it yours.
            </p>
            <div className="calculator-inputs">
              <label className="range-label" htmlFor="distance">
                <span>Monthly distance</span>
                <strong>{formatCompact(monthlyDistance)} <small>km</small></strong>
              </label>
              <input
                id="distance"
                type="range"
                min="300"
                max="5000"
                step="100"
                value={monthlyDistance}
                onChange={(event) => setMonthlyDistance(Number(event.target.value))}
                aria-label="Monthly commute distance in kilometres"
              />
              <div className="range-ends"><span>300 km</span><span>5,000 km</span></div>
              <div className="fuel-input-grid">
                <label htmlFor="petrol-price">
                  Petrol · PKR/L
                  <span className="fuel-rate-input">
                    <span>PKR</span>
                    <input
                      id="petrol-price"
                      type="number"
                      min="1"
                      max="1000"
                      value={petrolPrice}
                      onChange={(event) =>
                        setPetrolPrice(Math.max(1, Number(event.target.value) || 1))
                      }
                    />
                  </span>
                </label>
                <label htmlFor="diesel-price">
                  Diesel · PKR/L
                  <span className="fuel-rate-input">
                    <span>PKR</span>
                    <input
                      id="diesel-price"
                      type="number"
                      min="1"
                      max="1000"
                      value={dieselPrice}
                      onChange={(event) =>
                        setDieselPrice(Math.max(1, Number(event.target.value) || 1))
                      }
                    />
                  </span>
                </label>
              </div>
            </div>
          </div>
          <div className="calculator-results">
            <div className="results-header">
              <span>YOUR ESTIMATED FUEL COST</span>
              <span><Icon name="fuel" size={16} /> PKR</span>
            </div>
            {calculatorRows.map((row, index) => (
              <article className="cost-row" key={row.vehicle.id}>
                <div className="cost-row-title">
                  <span className={`cost-index cost-index-${row.vehicle.id}`}>0{index + 1}</span>
                  <div>
                    <strong>{row.vehicle.name}</strong>
                    <span>{row.vehicle.variant}</span>
                  </div>
                  <span className="cost-fuel-tag">
                    {row.vehicle.fuel === "petrol" ? "PETROL" : "DIESEL"}
                  </span>
                </div>
                <div className="cost-metrics">
                  <div>
                    <span>City / km</span>
                    <strong>{formatCostPerKm(row.cityCost)}</strong>
                  </div>
                  <div>
                    <span>Highway / km</span>
                    <strong>{formatCostPerKm(row.highwayCost)}</strong>
                  </div>
                  <div>
                    <span>Full tank · {row.vehicle.tankCapacity} L</span>
                    <strong>{formatPkr(row.fullTankCost)}</strong>
                  </div>
                  <div className="monthly-metric">
                    <span>Estimated monthly</span>
                    <strong>{formatPkr(row.monthlyCost)}</strong>
                  </div>
                  <div className="annual-metric">
                    <span>Estimated annual</span>
                    <strong>{formatPkr(row.annualCost)}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="calculator-footnote">
          <span><Icon name="spark" size={15} />A useful guide, not a promise.</span>
          <span>
            Indicative fuel economy: Yaris 12 / 16, Corolla 10 / 14, Fortuner
            diesel 8 / 11 km/L (city / highway). Monthly estimate assumes
            65% city and 35% highway driving. Actual results vary.
          </span>
        </div>
      </section>

      <section className="tracker-section section-pad" id="tracking">
        <div className="tracker-copy">
          <span className="eyebrow">
            <span className="eyebrow-line" />
            EVERY STEP, IN THE KNOW
          </span>
          <h2>Your Toyota is<br /><em>on its way.</em></h2>
          <p>
            A little anticipation is part of the journey. Check a sample order
            or get in touch with our team for a private update.
          </p>
          <div className="tracker-trust">
            <span className="tracker-trust-icon"><Icon name="shield" size={19} /></span>
            <span>
              <strong>Private demo lookup</strong>
              Lookups are used for this response only and aren’t saved.
            </span>
          </div>
        </div>
        <div className="tracker-panel">
          <div className="tracker-panel-head">
            <span className="panel-step"><Icon name="car" size={17} /></span>
            <div>
              <h3>Order tracker</h3>
              <span>Enter your purchase order or CNIC</span>
            </div>
            <span className="demo-pill">DEMO</span>
          </div>
          <div className="lookup-toggle" role="group" aria-label="Search by">
            <button
              className={lookupType === "po" ? "lookup-active" : ""}
              type="button"
              aria-pressed={lookupType === "po"}
              onClick={() => setLookupType("po")}
            >
              PO number
            </button>
            <button
              className={lookupType === "cnic" ? "lookup-active" : ""}
              type="button"
              aria-pressed={lookupType === "cnic"}
              onClick={() => setLookupType("cnic")}
            >
              CNIC
            </button>
          </div>
          <form className="lookup-form" onSubmit={(event) => findOrder(event)}>
            <label htmlFor="order-lookup">
              {lookupType === "po" ? "PURCHASE ORDER NUMBER" : "CNIC NUMBER"}
            </label>
            <div className="lookup-input-row">
              <input
                id="order-lookup"
                value={lookup}
                onChange={(event) => setLookup(event.target.value)}
                placeholder={lookupType === "po" ? "e.g. LM-26-0418" : "e.g. 00000-0000000-0"}
                inputMode={lookupType === "cnic" ? "numeric" : "text"}
                autoComplete="off"
              />
              <button type="submit" className="button button-primary">
                Check status <Icon name="arrow" size={17} />
              </button>
            </div>
          </form>
          <div className="sample-orders">
            <span>TRY A SAMPLE</span>
            {["LM-26-0418", "LM-26-0832", "LM-26-1027"].map((po) => (
              <button
                type="button"
                key={po}
                onClick={() => {
                  setLookup(po);
                  setLookupType("po");
                  void findOrder(undefined, po);
                }}
              >
                {po}
              </button>
            ))}
          </div>
          {trackingError && (
            <p className="form-message form-error" role="alert">{trackingError}</p>
          )}
          {trackedOrder && <OrderCard order={trackedOrder} />}
        </div>
      </section>

      <section className="booking-section section-pad" id="booking">
        <div className="booking-aside">
          <span className="eyebrow eyebrow-light">
            <span className="eyebrow-line" />
            THE FIRST STEP
          </span>
          <h2>Let’s get you<br /><em>moving.</em></h2>
          <p>
            A few details are all it takes to start a conversation with our
            team. We’ll take it from here, together.
          </p>
          <div className="booking-steps" aria-label={`Step ${bookingStep} of 2`}>
            <span className={bookingStep === 1 ? "booking-step-active" : ""}>01</span>
            <span className="booking-step-line" />
            <span className={bookingStep === 2 ? "booking-step-active" : ""}>02</span>
            <div>
              <strong>{bookingStep === 1 ? "A little about you" : "Choose your Toyota"}</strong>
              <span>{bookingStep === 1 ? "Your details" : "Your preferences"}</span>
            </div>
          </div>
          <div className="booking-aside-note">
            <Icon name="shield" size={18} />
            <span>
              <strong>Your privacy matters.</strong> Your name, CNIC and phone
              stay in this browser and are not sent or stored by this demo.
            </span>
          </div>
        </div>
        <div className="booking-form-panel">
          {bookingResult ? (
            <div className="booking-success">
              <span className="success-icon"><Icon name="check" size={25} /></span>
              <span className="eyebrow"><span className="eyebrow-line" />YOU’RE OFF TO A GREAT START</span>
              <h3>Your journey has a<br /><em>starting point.</em></h3>
              <p>
                We’ve created a simulated purchase reference. This is not a
                confirmed vehicle order—our team will help with the next steps.
              </p>
              <div className="booking-reference">
                <span>PURCHASE REFERENCE</span>
                <strong>{bookingResult.poNumber}</strong>
                <span>{bookingResult.variant}</span>
                <span>{bookingResult.paymentType} · {bookingResult.paidPercentage}% indicated</span>
              </div>
              <button
                className="button button-primary"
                type="button"
                onClick={() => {
                  setLookup(bookingResult.poNumber);
                  setLookupType("po");
                  setTrackedOrder(bookingResult);
                  document.getElementById("tracking")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                View sample tracking <Icon name="arrow" size={17} />
              </button>
              <button
                className="reset-booking"
                type="button"
                onClick={() => {
                  setBookingResult(null);
                  setBookingStep(1);
                }}
              >
                Start another enquiry
              </button>
            </div>
          ) : (
            <>
              <div className="booking-form-header">
                <span>ENQUIRE ABOUT YOUR NEXT TOYOTA</span>
                <span>STEP {bookingStep} OF 2</span>
              </div>
              <form className="booking-form" onSubmit={submitBooking}>
                {bookingStep === 1 ? (
                  <>
                    <div className="form-heading">
                      <h3>First, the essentials.</h3>
                      <p>Tell us how to reach you. All fields are required.</p>
                    </div>
                    <div className="field-grid">
                      <label className="field-label field-full" htmlFor="customer-name">
                        FULL NAME
                        <input
                          id="customer-name"
                          name="name"
                          autoComplete="name"
                          required
                          minLength={2}
                          maxLength={80}
                          value={booking.name}
                          onChange={(event) => updateBooking("name", event.target.value)}
                          placeholder="Your name"
                        />
                      </label>
                      <label className="field-label" htmlFor="customer-cnic">
                        CNIC
                        <input
                          id="customer-cnic"
                          name="cnic"
                          autoComplete="off"
                          required
                          inputMode="numeric"
                          pattern="[0-9]{5}-?[0-9]{7}-?[0-9]{1}"
                          title="Enter all 13 CNIC digits; dashes are optional."
                          maxLength={15}
                          value={booking.cnic}
                          onChange={(event) => updateBooking("cnic", event.target.value)}
                          placeholder="Enter 13 CNIC digits"
                        />
                      </label>
                      <label className="field-label" htmlFor="customer-phone">
                        MOBILE NUMBER
                        <input
                          id="customer-phone"
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          required
                          minLength={10}
                          maxLength={15}
                          value={booking.phone}
                          onChange={(event) => updateBooking("phone", event.target.value)}
                          placeholder="+92 300 1234567"
                        />
                      </label>
                      <label className="field-label" htmlFor="customer-city">
                        CITY
                        <select
                          id="customer-city"
                          value={booking.city}
                          onChange={(event) => updateBooking("city", event.target.value)}
                        >
                          {["Lahore", "Islamabad", "Karachi", "Faisalabad", "Multan", "Other"].map((city) => (
                            <option key={city}>{city}</option>
                          ))}
                        </select>
                      </label>
                      <label className="field-label" htmlFor="booking-filer">
                        TAX PROFILE
                        <select
                          id="booking-filer"
                          value={booking.filerStatus}
                          onChange={(event) => updateBooking("filerStatus", event.target.value)}
                        >
                          <option value="filer">Filer</option>
                          <option value="non-filer">Non-filer</option>
                        </select>
                      </label>
                    </div>
                    <div className="data-note">
                      <Icon name="shield" size={15} />
                      Your CNIC and phone stay in this browser; this demo
                      doesn’t send or store them.
                    </div>
                    <button className="button button-primary form-next" type="submit">
                      Continue to your Toyota <Icon name="arrow" size={18} />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="form-heading">
                      <h3>Make it your own.</h3>
                      <p>Choose a model and how you’d like to pay.</p>
                    </div>
                    <fieldset className="vehicle-picker">
                      <legend>CHOOSE A TOYOTA</legend>
                      <div className="booking-model-list">
                        {vehicles.map((vehicle) => (
                          <label
                            className={`booking-model ${booking.vehicleId === vehicle.id ? "booking-model-selected" : ""}`}
                            key={vehicle.id}
                          >
                            <input
                              type="radio"
                              name="vehicle"
                              value={vehicle.id}
                              checked={booking.vehicleId === vehicle.id}
                              onChange={(event) => updateBooking("vehicleId", event.target.value)}
                            />
                            <span className="model-radio" />
                            <span className="booking-model-copy">
                              <strong>{vehicle.name}</strong>
                              <span>{vehicle.variant}</span>
                            </span>
                            <span className="booking-model-price">{formatPkr(vehicle.price)}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                    <fieldset className="payment-picker">
                      <legend>PAYMENT PREFERENCE</legend>
                      <div className="payment-options">
                        {["Full Payment", "Half Payment"].map((option) => (
                          <label
                            className={`payment-option ${booking.paymentType === option ? "payment-option-selected" : ""}`}
                            key={option}
                          >
                            <input
                              type="radio"
                              name="payment"
                              value={option}
                              checked={booking.paymentType === option}
                              onChange={(event) => updateBooking("paymentType", event.target.value)}
                            />
                            <span className="model-radio" />
                            <span>
                              <strong>{option}</strong>
                              <small>{option === "Half Payment" ? "50% deposit indicated" : "Full amount indicated"}</small>
                            </span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                    <div className="booking-summary">
                      <span>{selectedBookingVehicle.name} · indicative ex-factory</span>
                      <strong>{formatPkr(selectedBookingVehicle.price)}</strong>
                      <span>
                        {booking.paymentType === "Half Payment" ? "50% indicated deposit" : "Full payment indicated"}{" "}
                        · {formatPkr(booking.paymentType === "Half Payment" ? selectedBookingVehicle.price / 2 : selectedBookingVehicle.price)}
                      </span>
                    </div>
                    <div className="form-actions">
                      <button
                        className="button button-quiet"
                        type="button"
                        onClick={() => setBookingStep(1)}
                      >
                        Back
                      </button>
                      <button className="button button-primary" type="submit">
                        Create demo enquiry <Icon name="arrow" size={18} />
                      </button>
                    </div>
                  </>
                )}
              </form>
            </>
          )}
        </div>
      </section>

      <section className="closing-band">
        <div className="closing-mark"><Icon name="location" size={21} /></div>
        <div>
          <span>WHEN YOU’RE READY, WE’RE RIGHT HERE.</span>
          <strong>Come by. Let’s talk Toyota.</strong>
        </div>
        <a href="tel:+9242111222213">Call our team <Icon name="arrow" size={17} /></a>
      </section>

      <footer className="site-footer">
        <a className="brand brand-footer" href="#home" aria-label="Lahore Motors home">
          <span className="brand-monogram" aria-hidden="true">LM</span>
          <span className="brand-wordmark"><strong>LAHORE</strong><span>MOTORS</span></span>
        </a>
        <span className="footer-copy">An independent Toyota dealership in Lahore, Pakistan.</span>
        <span className="footer-disclaimer">Illustrative demo · Not affiliated with or endorsed by Toyota or Indus Motor Company.</span>
        <span className="footer-year">© 2026</span>
      </footer>

      <div className="chat-widget">
        {chatOpen && (
          <section className="chat-panel" aria-label="Lahore Motors assistant">
            <div className="chat-header">
              <span className="chat-avatar"><Icon name="spark" size={19} /></span>
              <div>
                <strong>LM assistant</strong>
                <span><span className="online-dot" /> Here to help · Demo</span>
              </div>
              <button
                type="button"
                className="chat-close"
                aria-label="Close chat"
                onClick={() => setChatOpen(false)}
              >
                <Icon name="close" size={19} />
              </button>
            </div>
            <div className="chat-disclosure">
              Automated demo assistant. Answers may be incomplete; verify prices,
              financing and order details with our team.
            </div>
            <div className="chat-messages" aria-live="polite">
              {chatMessages.map((message, index) => (
                <p
                  key={`${message.role}-${index}`}
                  className={`chat-bubble ${message.role === "user" ? "chat-bubble-user" : ""}`}
                >
                  {message.text}
                </p>
              ))}
            </div>
            <div className="chat-quick-prompts">
              {quickQuestions.map((question) => (
                <button type="button" key={question} onClick={() => sendChatMessage(question)}>
                  {question}
                </button>
              ))}
            </div>
            <form
              className="chat-input"
              onSubmit={(event) => {
                event.preventDefault();
                sendChatMessage();
              }}
            >
              <label className="sr-only" htmlFor="chat-question">Ask a question</label>
              <input
                id="chat-question"
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                placeholder="Ask us anything…"
              />
              <button type="submit" aria-label="Send message" disabled={!chatInput.trim()}>
                <Icon name="send" size={18} />
              </button>
            </form>
          </section>
        )}
        <button
          type="button"
          className={`chat-launcher ${chatOpen ? "chat-launcher-open" : ""}`}
          aria-label={chatOpen ? "Close dealership assistant" : "Open dealership assistant"}
          aria-expanded={chatOpen}
          onClick={() => setChatOpen((open) => !open)}
        >
          <Icon name={chatOpen ? "close" : "chat"} size={22} />
          {!chatOpen && <span>Ask LM</span>}
        </button>
      </div>
    </main>
  );
}
