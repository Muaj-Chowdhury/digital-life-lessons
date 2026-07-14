import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";
import HeroSlider from "./HeroSlider";
import FeaturedLessons from "./FeaturedLessons";
import WhyLifeMatters from "./WhyLifeMatters";
import TopContributors from "./TopContributors";
import MostSaved from "./MostSaved";
import Loading from "../../../component/shared/Loading";
import Container from "../../../component/shared/Container"

export default function Home() {
  const axiosInstance = useAxios();
  const { data = {}, isLoading } = useQuery({
    queryKey: ["home-overview"],
    queryFn: async () => {
      const res = await axiosInstance.get("/home/overview");
      return res?.data || {};
    }
  });

  if (isLoading) return <Loading />;

  return (
    <main className="overflow-x-hidden">
      <HeroSlider />
      
      {/* Value Proposition - White background for clarity */}
      <section className="bg-base-100">
        <Container><WhyLifeMatters /></Container>
      </section>

      {/* Featured Lessons - Subtle tint for section separation */}
      <section className="bg-base-200 py-20">
        <Container><FeaturedLessons lessons={data?.featured} /></Container>
      </section>

      {/* Social Proof Section */}
      <section className="bg-base-100 py-20">
        <Container><MostSaved lessons={data?.mostSaved} /></Container>
      </section>

      {/* Contributors - Darker contrast or Gradient */}
      {data?.contributors?.length > 0 && 
      <section className="bg-primary/5 py-20 border-t border-base-300">
        <Container>
           <TopContributors data={data?.contributors} />
        </Container>
      </section>}
    </main>
  );
}
