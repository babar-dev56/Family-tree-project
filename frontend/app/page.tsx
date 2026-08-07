import BannerSection from "./components/home-component/BannerSection";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <BannerSection />
      <div style={{ padding: 24 }}>
        <p>
          Verify Firebase by visiting <Link href="/test-firebase">/test-firebase</Link>.
        </p>
      </div>
    </>
  );
}