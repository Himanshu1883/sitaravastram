import HeroSection from '../components/home/HeroSection';
import TrustBar from '../components/home/TrustBar';
import CategorySection from '../components/home/CategorySection';
import NewArrivals from '../components/home/NewArrivals';
import BestSellers from '../components/home/BestSellers';
import ShopByFabric from '../components/home/ShopByFabric';
import ShopByOccasion from '../components/home/ShopByOccasion';
import FeaturedCollection from '../components/home/FeaturedCollection';
import CustomerReviews from '../components/home/CustomerReviews';
import InstagramFeed from '../components/home/InstagramFeed';
import Newsletter from '../components/home/Newsletter';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <TrustBar />
      <CategorySection />
      <NewArrivals />
      <BestSellers />
      <ShopByFabric />
      <ShopByOccasion />
      <FeaturedCollection />
      <CustomerReviews />
      <InstagramFeed />
      <Newsletter />
    </main>
  );
}
