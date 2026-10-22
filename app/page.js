import Link from "next/link";
import { FiZap, FiChevronRight } from "react-icons/fi";
import BannerSlider from "@/components/BannerSlider";
import ProductCard from "@/components/ProductCard";
import { serverApiFetch } from "@/lib/server-api";

export const dynamic = "force-dynamic";

const topicColors = [
  ["#e3f7ea", "#1c7d3f"],
  ["#e5effd", "#245b93"],
  ["#fff0c9", "#805900"],
  ["#ffe39a", "#755000"],
  ["#ffe0d2", "#9a4025"],
];

/* ========================================
   TEMPORARY FLASH SALE MOCK DATA

   পরে backend থেকে এই data আসবে
======================================== */

const flashSale = {
  active: true,

  eyebrow: "LIMITED TIME · UP TO 20% OFF",

  title: "Flash Sale",

  description:
    "সীমিত সময়ের জন্য ছাড় — নির্বাচিত কোর্স ও প্রোডাক্ট। অফার শেষ হওয়ার আগে কিনে নিন।",

  buttonText: "View all",

  buttonLink: "/courses",

  countdown: {
    days: "02",
    hours: "11",
    minutes: "34",
    seconds: "05",
  },
};

function initials(name = "") {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((x) => x[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

async function loadHomeData() {
  try {
    const [products, categories] = await Promise.all([
      serverApiFetch("/products?limit=24", {
        cache: "no-store",
      }),

      serverApiFetch("/categories?parent=root", {
        cache: "no-store",
      }),
    ]);

    return {
      products: products?.data || [],
      categories: categories?.data || [],
    };
  } catch (error) {
    console.error("Failed to load home data:", error);

    return {
      products: [],
      categories: [],
    };
  }
}

export default async function HomePage() {
  const { products, categories } = await loadHomeData();

  const courses = products.filter((product) =>
    ["recorded_course", "live_course"].includes(product.type),
  );

  const loved = [...courses]
    .sort(
      (a, b) =>
        Number(b.ratingSummary?.average || 0) -
        Number(a.ratingSummary?.average || 0),
    )
    .slice(0, 8);

  return (
    <>
      {/* ========================================
          HERO SECTION
      ======================================== */}

      <section className="hero-split">
        <div className="container hero-split-inner">
          <div className="hero-message">
            <span className="hero-message-badge">Trending</span>

            <h1>Microsoft Office-এ দক্ষ হয়ে উঠুন, আজ থেকেই!</h1>

            <p>
              Excel, Word, PowerPoint ও Power Query — কাজের জন্য প্রয়োজনীয়
              Practical Skills শিখুন সহজভাবে।
            </p>

            <Link className="btn hero-message-btn" href="/courses">
              কোর্সগুলো দেখুন
            </Link>
          </div>

          <div className="banner-col">
            <h3 className="banner-heading">
              কোর্সে দ্রুত প্রবেশ করতে এখনি আপনারা পছন্দের ব্যানারে click করুন।
            </h3>

            <BannerSlider />
          </div>
        </div>
      </section>

      {/* ========================================
          FLASH SALE
      ======================================== */}

      {flashSale.active && (
        <section className="flash-sale-section">
          <div className="container">
            <div className="flash-sale-card">
              {/* Header */}

              <div className="flash-sale-header">
                <div className="flash-sale-icon">
                  <FiZap />
                </div>

                <div className="flash-sale-heading-area">
                  <div className="flash-sale-eyebrow">{flashSale.eyebrow}</div>

                  <h2 className="flash-sale-title">{flashSale.title}</h2>
                </div>
              </div>

              {/* Description */}

              <p className="flash-sale-description">{flashSale.description}</p>

              {/* Countdown */}

              <div className="flash-sale-countdown">
                <div className="flash-sale-ends-in">ENDS IN</div>

                <div className="flash-sale-time-box">
                  <strong>{flashSale.countdown.days}</strong>

                  <span>DAYS</span>
                </div>

                <div className="flash-sale-time-box">
                  <strong>{flashSale.countdown.hours}</strong>

                  <span>HRS</span>
                </div>

                <div className="flash-sale-colon">:</div>

                <div className="flash-sale-time-box">
                  <strong>{flashSale.countdown.minutes}</strong>

                  <span>MIN</span>
                </div>

                <div className="flash-sale-time-box">
                  <strong>{flashSale.countdown.seconds}</strong>

                  <span>SEC</span>
                </div>
              </div>

              {/* Button */}

              <Link href={flashSale.buttonLink} className="flash-sale-button">
                {flashSale.buttonText}

                <FiChevronRight />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ========================================
          MOST LOVED COURSES
      ======================================== */}

      <section className="section most-loved-section">
        <div className="container">
          <span className="ey">STUDENTS&apos; FAVORITES</span>

          <h2>আপনাদের সবচেয়ে বেশি প্রিয় কোর্স গুলো</h2>

          <p>Most Loved Courses — ranked by student ♥ reactions.</p>

          {loved.length ? (
            <div className="service-grid loved-grid">
              {loved.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="product-list-empty">
              Published courses will appear here from the backend.
            </div>
          )}
        </div>
      </section>

      {/* ========================================
          VIDEO SECTION
      ======================================== */}

      <section className="video-section">
        <div className="container">
          <span className="ey">WELCOME</span>

          <h2 className="video-section-heading">Welcome genious</h2>

          <div className="video-box">
            <div className="video-title">
              A quick introduction to your learning journey
            </div>

            <video
              autoPlay
              muted
              playsInline
              controls
              controlsList="nodownload noremoteplayback"
              disablePictureInPicture
            >
              <source src="/assets/videos/welcome-1.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* ========================================
          LEARNING TOPICS
      ======================================== */}

      <section className="learn-topics">
        <div className="container">
          <span className="ey">START YOUR LEARNING JOURNEY</span>

          <h2>
            আপনি আজকে কি <span>শিখতে </span> চান?
          </h2>

          <p>
            Choose a category and continue to Recorded or Live courses
            dynamically.
          </p>

          <div className="topic-grid">
            {categories.map((category, index) => {
              const [bg, color] = topicColors[index % topicColors.length];

              return (
                <Link
                  className="topic-card"
                  href={`/courses/${category.slug}`}
                  key={category._id}
                >
                  <span
                    className="topic-icon"
                    style={{
                      background: bg,
                      color,
                    }}
                  >
                    {initials(category.name)}
                  </span>

                  <span className="topic-label">
                    {category.name}

                    <i
                      style={{
                        background: color,
                      }}
                    />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================
          ALL SERVICES
      ======================================== */}

      <section className="section home-services">
        <div className="container">
          <span className="ey">ALL SERVICES</span>

          <h2>Explore all courses & products.</h2>

          <p>
            Courses, e-books, digital products and bundles are loaded directly
            from the backend.
          </p>

          {products.length ? (
            <div className="service-grid loved-grid">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="product-list-empty">
              No published products found yet.
            </div>
          )}
        </div>
      </section>

      {/* ========================================
          FLASH SALE CSS
      ======================================== */}

      <style>{`

        .flash-sale-section {
          width: 100%;
          padding: 25px 0 35px;
          box-sizing: border-box;
        }

        .flash-sale-card {
          position: relative;

          width: 100%;
          min-height: 343px;

          box-sizing: border-box;

          padding: 33px 26px 28px;

          border-radius: 24px;

          overflow: hidden;

          color: #ffffff;

          background:
            linear-gradient(
              110deg,
              #350002 0%,
              #480205 28%,
              #580307 57%,
              #730d14 100%
            );

          box-shadow:
            0 15px 35px rgba(0, 0, 0, 0.12);
        }


        /* ===============================
           HEADER
        =============================== */

        .flash-sale-header {
          display: flex;
          align-items: center;

          gap: 14px;
        }

        .flash-sale-icon {
          width: 55px;
          height: 55px;

          flex: 0 0 55px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 16px;

          background: #00a84f;

          color: white;

          box-shadow:
            0 7px 18px rgba(0, 168, 79, 0.4);
        }

        .flash-sale-icon svg {
          width: 29px;
          height: 29px;

          stroke-width: 2;
        }

        .flash-sale-heading-area {
          display: flex;
          flex-direction: column;

          justify-content: center;
        }

        .flash-sale-eyebrow {
          margin-bottom: 6px;

          font-size: 11px;
          line-height: 1;

          font-weight: 500;

          letter-spacing: 0.9px;

          text-transform: uppercase;

          color: #ffd0d2;
        }

        .flash-sale-title {
          margin: 0;

          padding: 0;

          font-size: 29px;
          line-height: 1.1;

          font-weight: 700;

          color: #ffffff;
        }


        /* ===============================
           DESCRIPTION
        =============================== */

        .flash-sale-description {
          margin: 20px 0 0;

          max-width: 700px;

          color: rgba(255, 255, 255, 0.92);

          font-size: 14px;
          line-height: 1.7;

          font-weight: 400;
        }


        /* ===============================
           COUNTDOWN
        =============================== */

        .flash-sale-countdown {
          display: flex;

          align-items: center;

          gap: 18px;

          margin-top: 21px;
        }

        .flash-sale-ends-in {
          margin-right: 2px;

          font-size: 11px;

          font-weight: 500;

          letter-spacing: 0.8px;

          color: #ffd3d5;
        }

        .flash-sale-time-box {
          width: 84px;
          height: 85px;

          box-sizing: border-box;

          display: flex;

          flex-direction: column;

          align-items: center;

          justify-content: center;

          border-radius: 12px;

          background: rgba(255, 255, 255, 0.08);
        }

        .flash-sale-time-box strong {
          display: block;

          margin: 0;

          color: white;

          font-size: 36px;

          line-height: 1;

          font-weight: 700;
        }

        .flash-sale-time-box span {
          display: block;

          margin-top: 8px;

          color: #ffd5d7;

          font-size: 11px;

          line-height: 1;

          font-weight: 500;

          letter-spacing: 0.7px;
        }

        .flash-sale-colon {
          margin-left: -7px;
          margin-right: -7px;

          color: #ffd2d4;

          font-size: 27px;

          font-weight: 700;
        }


        /* ===============================
           BUTTON
        =============================== */

        .flash-sale-button {
          width: fit-content;

          min-width: 134px;

          height: 52px;

          margin-top: 22px;

          box-sizing: border-box;

          display: inline-flex;

          align-items: center;

          justify-content: center;

          gap: 8px;

          padding: 0 24px;

          border-radius: 50px;

          background: #00a84f;

          color: #ffffff;

          text-decoration: none;

          font-size: 16px;

          font-weight: 700;

          transition:
            background 0.2s ease,
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .flash-sale-button svg {
          width: 18px;
          height: 18px;
        }

        .flash-sale-button:hover {
          background: #009344;

          transform: translateY(-1px);

          box-shadow:
            0 7px 18px rgba(0, 168, 79, 0.28);
        }


        /* ===============================
           TABLET
        =============================== */

        @media (max-width: 768px) {

          .flash-sale-section {
            padding: 20px 0 30px;
          }

          .flash-sale-card {
            min-height: auto;

            padding: 26px 20px;

            border-radius: 20px;
          }

          .flash-sale-title {
            font-size: 26px;
          }

          .flash-sale-description {
            margin-top: 18px;

            font-size: 14px;
          }

          .flash-sale-countdown {
            gap: 12px;
          }

          .flash-sale-time-box {
            width: 72px;
            height: 76px;
          }

          .flash-sale-time-box strong {
            font-size: 30px;
          }

        }


        /* ===============================
           MOBILE
        =============================== */

        @media (max-width: 520px) {

          .flash-sale-section {
            padding: 15px 0 25px;
          }

          .flash-sale-card {
            padding: 22px 16px;

            border-radius: 18px;
          }

          .flash-sale-header {
            gap: 12px;
          }

          .flash-sale-icon {
            width: 50px;
            height: 50px;

            flex-basis: 50px;

            border-radius: 14px;
          }

          .flash-sale-icon svg {
            width: 25px;
            height: 25px;
          }

          .flash-sale-eyebrow {
            font-size: 9px;

            line-height: 1.3;
          }

          .flash-sale-title {
            font-size: 23px;
          }

          .flash-sale-description {
            margin-top: 17px;

            font-size: 13px;

            line-height: 1.6;
          }

          .flash-sale-countdown {
            display: grid;

            grid-template-columns:
              repeat(4, minmax(0, 1fr));

            gap: 8px;

            margin-top: 20px;
          }

          .flash-sale-ends-in {
            grid-column: 1 / -1;

            margin: 0 0 3px;

            font-size: 10px;
          }

          .flash-sale-time-box {
            width: 100%;

            height: 68px;
          }

          .flash-sale-time-box strong {
            font-size: 25px;
          }

          .flash-sale-time-box span {
            margin-top: 6px;

            font-size: 8px;
          }

          .flash-sale-colon {
            display: none;
          }

          .flash-sale-button {
            height: 46px;

            min-width: 120px;

            margin-top: 20px;

            padding: 0 20px;

            font-size: 14px;
          }

        }

      `}</style>
    </>
  );
}
