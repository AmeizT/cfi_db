import { format } from "date-fns";

export const getCurrentYear = () => format(new Date(), "yyyy")