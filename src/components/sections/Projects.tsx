import routoraMobile from "../../assets/Projects/routora.png";
import driverAdv from "../../assets/Projects/driver-adv.png";
import { CardBody, CardContainer, CardItem } from "../../components/ui/3d-card";

const posts = [
  {
    id: 1,
    name: "Routora Mobile App",
    href: "https://www.routora.com/app-install",
    type: "Mobile App",
    description:
      "Routora is a cross-platform mobile app designed to optimize multi-stop routes, making driving more efficient for users worldwide. With over 25,000 users in 70+ countries—including Amazon drivers, realtors, and small business owners—Routora has helped save more than 1 million miles on the road.",
    imageUrl: routoraMobile,
    date: "Dec 2022 - Present",
  },
  {
    id: 2,
    name: "Driver Advisor",
    href: "https://youtu.be/tX4mBHLCjjc",
    type: "Mobile App",
    description:
      "A mobile app that uses an in-house trained machine learning model to recognize and communicate street signs to users to help make the driving experience safer.",
    imageUrl: driverAdv,
    date: "Nov 2022",
  },
  // More posts...
];

export default function Projects() {
  return (
    <>
      <div
        id="projects"
        className="text-gray-200 my-10 text-center font-bold text-5xl tracking-tight"
      >
        Projects
      </div>
      <div className="relative bg-black h-auto items-center justify-center mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ul
          role="list"
          className="grid grid-cols-1 gap-6 lg:grid-cols-2 overflow-hidden"
        >
          {posts.map((post) => (
            <li
              key={post.id}
              className="col-span-1 flex flex-col divide-y text-center"
            >
              <CardContainer className="inter-var">
                <CardBody className="bg-slate-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-[30rem] h-[40rem] rounded-xl p-6 border  ">
                  <CardItem
                    translateZ="50"
                    className="text-xl font-bold text-neutral-600 dark:text-white"
                  >
                    {post.name}
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="60"
                    className="text-neutral-500 h-[8rem] text-sm max-w-sm mt-2 dark:text-neutral-300"
                  >
                    {post.description}
                  </CardItem>
                  <CardItem translateZ="100" className="w-full mt-4">
                    <img
                      src={post.imageUrl}
                      height="1000"
                      width="1000"
                      className="mx-auto object-contain h-auto max-h-[20rem] w-auto rounded-lg group-hover/card:shadow-xl"
                      alt="thumbnail"
                    />
                  </CardItem>
                  <div className="flex justify-between items-center mt-8">
                    <CardItem
                      translateZ={20}
                      href="https://twitter.com/mannupaaji"
                      target="__blank"
                      className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
                    >
                      Mobile App
                    </CardItem>
                    <CardItem
                      translateZ={20}
                      as="a"
                      href={post.href}
                      className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                    >
                      Check it out!
                    </CardItem>
                  </div>
                </CardBody>
              </CardContainer>
              {/* <div className="flex flex-1 flex-col p-8">
              <img
                alt=""
                src={post.imageUrl}
                className="mx-auto h-auto size-72 rounded-lg"
              />
              <h3 className="mt-6 text-md font-medium text-gray-900">
                {post.name}
              </h3>
              <dl className="mt-1 flex grow flex-col justify-between">
                <dt className="sr-only">Title</dt>
                <dd className="text-sm text-gray-500">{post.description}</dd>
                <dt className="sr-only">Role</dt>
                <dd className="mt-3">
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    {post.type}
                  </span>
                </dd>
              </dl>
            </div> */}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
