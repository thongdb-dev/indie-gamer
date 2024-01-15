import Heading from "@/components/Heading";
import { getReview } from "@/lib/reviews";

export default async function StardewValleyPage() {
  const { title, date, image, html } = await getReview();

  return (
    <>
      <Heading>{title}</Heading>
      <p className="italic pb-2">{date}</p>
      <img
        src={image}
        alt=""
        width={640}
        height={360}
        className="mb-2 rounded"
      />
      <article
        dangerouslySetInnerHTML={{ __html: html }}
        className="max-w-screen-sm prose prose-slate"
      ></article>
    </>
  );
}
