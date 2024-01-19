import { marked } from "marked";
import qs from "qs";

const CMS_URL = 'http://localhost:1337';

interface CmsItem {
  id: number;
  attributes: any;
}

export interface Review {
  slug: string;
  title: string;
  date: string;
  image: string;
  body?: string | Promise<string>;
}

export async function getReview(slug: string): Promise<Review> {
  const { data } = await fetchReviews({
    filters: { slug: { $eq: slug } },
    fields: ["slug", "title", "subtitle", "publishedAt", "body"],
    populate: { image: { fields: ["url"] } },
    sort: ["publishedAt:desc"],
    pagination: { pageSize: 1, withCount: false },
  });
  const item = data[0];

  return {
    ...convertToReview(item),
    body: marked(item.attributes.body),
  };
}

export async function getReviews(pageSize: number): Promise<Review[]> {
  const { data } = await fetchReviews({
    fields: ["slug", "title", "subtitle", "publishedAt"],
    populate: { image: { fields: ["url"] } },
    sort: ["publishedAt:desc"],
    pagination: { pageSize },
  });

  return data.map(convertToReview);
}

export async function getSlugs(): Promise<string[]> {
  const { data } = await fetchReviews({
    fields: ["slug"],
    sort: ["publishedAt:desc"],
    pagination: { pageSize: 100 },
  });

  return data.map((item: CmsItem) => item.attributes.slug);
}

async function fetchReviews(params: any) {
  const url =
    `${CMS_URL}/api/reviews` +
    "?" +
    qs.stringify(params, { encodeValuesOnly: true });

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`CMS returned ${response.status} for ${url}`);
  }
  return await response.json();
}

function convertToReview(item: CmsItem): Review {
  const { attributes } = item;
  return {
    slug: attributes.slug,
    title: attributes.title,
    date: attributes.publishedAt.slice(0, 'yyy-mm-dd'.length),
    image: CMS_URL + attributes.image.data.attributes.url
  }
}