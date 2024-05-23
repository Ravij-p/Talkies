import {
  IconArtboard,
  IconBookmark,
  IconGridDots,
  IconHeart,
  IconHome,
  IconMessage,
  IconSend,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
export const stats = [
  {
    id: 1,
    name: "Save",
    icon: <IconBookmark />,
    url: "/saveShow",
  },
  {
    id: 2,
    name: "Comment",
    icon: <IconMessage />,
    url: "/commentShow",
  },
  {
    id: 3,
    name: "Like",
    icon: <IconHeart />,
    url: "/likeShow",
  },
];

export const navigations = [
  {
    id: 1,
    name: "Feed",
    icon: <IconHome />,
    url: "/feed",
    count: 0,
  },
  {
    id: 2,
    name: "Follow Request",
    icon: <IconArtboard />,
    url: "/followRequest",
    count: 0,
  },
  {
    id: 3,
    name: "Profile",
    icon: <IconUser />,
    url: "/profile",
    count: 0,
  },
];
