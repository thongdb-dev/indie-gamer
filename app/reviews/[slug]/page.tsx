import Heading from "@/components/Heading";
import ShareLinkButton from "@/components/ShareLinkButton";
import { getReview, getSlugs } from "@/lib/reviews";
import { Metadata } from "next";
import Image from "next/image";

interface ReviewPageParams {
  slug: string;
}
interface ReviewPageProps {
  params: ReviewPageParams;
}

export async function generateStaticParams(): Promise<ReviewPageParams[]> {
  const slugs = await getSlugs();
  return slugs.map((slug: string) => ({ slug }));
}

export async function generateMetadata({
  params: { slug },
}: ReviewPageProps): Promise<Metadata> {
  const review = await getReview(slug);
  return {
    title: review.title,
  };
}

export default async function ReviewPage({
  params: { slug },
}: ReviewPageProps) {
  const { title, subtitle, date, image, body } = await getReview(slug);

  return (
    <>
      <Heading>{title}</Heading>
      <p className="font-semibold pb-3">{subtitle}</p>
      <div className="flex gap-3 items-baseline">
        <p className="italic pb-2">{date}</p>
        <ShareLinkButton />
      </div>
      <Image
        src={image}
        alt=""
        priority
        width={640}
        height={360}
        className="mb-2 rounded"
      />
      <article
        dangerouslySetInnerHTML={{ __html: body }}
        className="max-w-screen-sm prose prose-slate"
      ></article>
    </>
  );
}
