export type Vehicle = {
  id: string;
  name: string;
  variant: string;
  category: string;
  image: string;
  imageAlt: string;
  price: number;
  engineCc: number;
  engine: string;
  horsepower: number;
  torque: number;
  transmission: string;
  dimensions: string;
  safety: string;
  cityKmPerLitre: number;
  highwayKmPerLitre: number;
  tankCapacity: number;
  fuel: "petrol" | "diesel";
  accent: string;
};

export const vehicles: Vehicle[] = [
  {
    id: "yaris",
    name: "Yaris",
    variant: "1.3 ATIV CVT",
    category: "COMPACT SEDAN",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Sleek white sedan on a city street",
    price: 6_385_000,
    engineCc: 1329,
    engine: "1,329 cc",
    horsepower: 98,
    torque: 123,
    transmission: "7-speed CVT",
    dimensions: "4,425 × 1,730 × 1,475 mm",
    safety: "Dual airbags · ABS · VSC",
    cityKmPerLitre: 12,
    highwayKmPerLitre: 16,
    tankCapacity: 42,
    fuel: "petrol",
    accent: "#c5e8e8",
  },
  {
    id: "corolla",
    name: "Corolla",
    variant: "Altis Grande X 1.8",
    category: "EXECUTIVE SEDAN",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Modern silver executive sedan",
    price: 8_899_000,
    engineCc: 1798,
    engine: "1,798 cc",
    horsepower: 138,
    torque: 173,
    transmission: "7-speed CVT",
    dimensions: "4,630 × 1,780 × 1,455 mm",
    safety: "7 airbags · ABS · VSC · HAC",
    cityKmPerLitre: 10,
    highwayKmPerLitre: 14,
    tankCapacity: 50,
    fuel: "petrol",
    accent: "#d9e3ed",
  },
  {
    id: "fortuner",
    name: "Fortuner",
    variant: "2.8 Sigma 4 4×4 Diesel",
    category: "FULL-SIZE SUV",
    image:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Powerful dark SUV in the mountains",
    price: 19_499_000,
    engineCc: 2755,
    engine: "2,755 cc diesel",
    horsepower: 201,
    torque: 500,
    transmission: "6-speed automatic",
    dimensions: "4,795 × 1,855 × 1,835 mm",
    safety: "7 airbags · ABS · VSC · DAC",
    cityKmPerLitre: 8,
    highwayKmPerLitre: 11,
    tankCapacity: 80,
    fuel: "diesel",
    accent: "#e1ddce",
  },
];

export type FilerStatus = "filer" | "non-filer";

type DemoOrderRecord = {
  poNumber: string;
  variant: string;
  color: string;
  paymentType: string;
  vehicleId: string;
  branch: string;
  status: string;
  deliveryDate: string;
};

const demoOrderRecords: DemoOrderRecord[] = [
  {
    poNumber: "LM-26-0418",
    variant: "Corolla Altis Grande X 1.8",
    color: "Celestite Grey",
    paymentType: "Half Payment",
    vehicleId: "corolla",
    branch: "Lahore Motors · Gulberg",
    status: "In Transit",
    deliveryDate: "18 Nov – 25 Nov 2026",
  },
  {
    poNumber: "LM-26-0832",
    variant: "Yaris 1.3 ATIV CVT",
    color: "Super White",
    paymentType: "Full Payment",
    vehicleId: "yaris",
    branch: "Lahore Motors · DHA",
    status: "Ready at Dealership",
    deliveryDate: "Ready for collection",
  },
  {
    poNumber: "LM-26-1027",
    variant: "Fortuner 2.8 Sigma 4 4×4 Diesel",
    color: "Attitude Black",
    paymentType: "Half Payment",
    vehicleId: "fortuner",
    branch: "Lahore Motors · Gulberg",
    status: "Under Assembly at IMC Plant",
    deliveryDate: "Estimated Dec 2026",
  },
];

export function getDemoOrder(value: string) {
  const lookup = value.trim().toUpperCase();
  const isDemoCnic = lookup.replace(/\D/g, "") === "0000000000000";
  const order =
    demoOrderRecords.find((item) => item.poNumber === lookup) ??
    (isDemoCnic ? demoOrderRecords[0] : undefined);
  if (!order) return null;

  const vehicle = vehicles.find((item) => item.id === order.vehicleId);
  if (!vehicle) return null;

  return {
    ...order,
    ...getOrderPayment(vehicle.price, order.paymentType),
    vehiclePrice: vehicle.price,
    isDemo: true,
  };
}

export function getWhtRate(vehicle: Vehicle, filerStatus: FilerStatus) {
  if (vehicle.engineCc <= 1300) return filerStatus === "filer" ? 0.015 : 0.045;
  if (vehicle.engineCc <= 1600) return filerStatus === "filer" ? 0.02 : 0.06;
  if (vehicle.engineCc <= 1800) return filerStatus === "filer" ? 0.03 : 0.09;
  if (vehicle.engineCc <= 2500) return filerStatus === "filer" ? 0.07 : 0.21;
  return filerStatus === "filer" ? 0.09 : 0.27;
}

export function formatPkr(amount: number) {
  return `PKR ${new Intl.NumberFormat("en-PK", {
    maximumFractionDigits: 0,
  }).format(Math.round(amount))}`;
}

export function getOrderPayment(price: number, paymentType: string) {
  const paidPercentage = paymentType === "Half Payment" ? 50 : 100;
  const paidAmount = Math.round((price * paidPercentage) / 100);
  return {
    paidPercentage,
    paidAmount,
    balanceDue: price - paidAmount,
  };
}
