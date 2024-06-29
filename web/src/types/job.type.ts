type LocationType = {
  _id: string;
  province: string;
  district: string;
  address: string;
};
type JobType = {
  _id: string;
  age: {
    type: number;
  };
  experience: {
    fixed?: number;
    type: number;
    max?: number;
  };
  salary: {
    type: number;
    min: number;
    max: number;
  };
  benefit: string[];
  category: string[];
  certificate: string | null;
  company: string;
  description: string[];
  expiration: string;
  location: LocationType[];
  logo: string;
  requirement: string[];
  role: number;
  sex: "0" | "1";
  title: string;
  type: number[];
  update_time: string;
  url: string;
};
