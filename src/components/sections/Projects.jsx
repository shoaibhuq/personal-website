import routoraMobile from "../../assets/Projects/routora.png";
const posts = [
  {
    id: 1,
    name: "Routora Mobile App",
    href: "https://www.routora.com/app-install",
    type: "Mobile App",
    description:
      "Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.",
    imageUrl: routoraMobile,
    date: "Dec 2022 - Present",
    datetime: "2020-03-16",
  },
  {
    id: 1,
    name: "Routora Mobile App",
    href: "https://www.routora.com/app-install",
    type: "Mobile App",
    description:
      "Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.",
    imageUrl: routoraMobile,
    date: "Dec 2022 - Present",
    datetime: "2020-03-16",
  },
  {
    id: 1,
    name: "Routora Mobile App",
    href: "https://www.routora.com/app-install",
    type: "Mobile App",
    description:
      "Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.",
    imageUrl: routoraMobile,
    date: "Dec 2022 - Present",
    datetime: "2020-03-16",
  },
  // More posts...
];

export default function Projects() {
  return (
    <div className="relative bg-black h-auto items-center justify-center mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <ul
        role="list"
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 overflow-hidden"
      >
        {posts.map((post) => (
          <li
            key={post.email}
            className="col-span-1 flex flex-col divide-y divide-gray-200 fill-tra rounded-3xl bg-white/75 text-center shadow"
          >
            <div className="flex flex-1 flex-col p-8">
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
                    {post.role}
                  </span>
                </dd>
              </dl>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
