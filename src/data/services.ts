import fullSessionImage from "../images/blog/family-ducks-pond.jpg";

export const services = [
  {
    id: "quick",
    image: {
      src: "https://images.mellsnap.co.uk/file/mellsnap-website/services/046-Web.jpg",
      alt: "Toddler sitting in autumn leaves during a quick family photoshoot in a London park",
    },
    title: "Quick Session",
    price: "£180",
    duration: "20 minutes",
    features: [
      "20+ digital images",
      "Fully edited photos",
      "Private online gallery",
      "Print-ready files",
      "Quick turnaround",
    ],
    ctaLink: "/quick-photoshoot/",
  },
  {
    id: "full",
    image: {
      src: fullSessionImage,
      alt: "Parents smiling as their toddler meets the ducks by a pond in the park",
    },
    title: "Full Session",
    price: "£300",
    duration: "1 hour",
    features: [
      "80+ digital images",
      "Fully edited photos",
      "Private online gallery",
      "Print-ready files",
      "Location of your choice within my coverage area",
    ],
    featured: true,
    ctaLink: "/full-photoshoot/",
  },
  {
    id: "event",
    image: {
      src: "https://images.mellsnap.co.uk/file/mellsnap-website/services/238-Web.jpg",
      alt: "Birthday girl having fun with her friends at a children's party",
    },
    title: "Event Coverage",
    price: "£300",
    duration: "first hour",
    features: [
      "80+ digital images per hour",
      "£100 for each additional hour",
      "Fully edited photos",
      "Private online gallery",
      "Print-ready files",
      "Flexible duration",
    ],
    ctaLink: "/event-photography/",
  },
];
