'use client';
import React, { useEffect, useRef, MutableRefObject } from "react";
import Contact from "./components/sections/Contact";
import Testimonials from "./components/sections/Testimonials";
import Categories from "./components/sections/Categories";
import Freelancers from "./components/sections/Freelancers";
import Statistics from "./components/sections/Statistics";
import HowWork from "./components/sections/HowWork";
import Hero from "./components/sections/Hero";
import Partners from "./components/sections/Partners";
import {
  Category,
  ContactSection,
  ExpertSection,
  HeroSection,
  HowToWork,
  Statistic,
  Testimonial,
} from "@/types/home.type";
import { Partner } from "@/types/home.type";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// GSAP ScrollTrigger'ı kaydet
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Props {
  heroData: HeroSection[];
  partnerListData: Partner[];
  expertSectionData: ExpertSection[];
  howToWorkListData: HowToWork[];
  categoriesListData: Category[];
  statisticListData: Statistic[];
  getTestimonials: Testimonial[];
  contactSectionData: ContactSection[];
}

const HomePage = ({
  heroData,
  partnerListData,
  expertSectionData,
  howToWorkListData,
  categoriesListData,
  statisticListData,
  getTestimonials,
  contactSectionData,
}: Props) => {
  // Bileşen referansları
  const heroRef = useRef<HTMLDivElement>(null);
  const partnersRef = useRef<HTMLDivElement>(null);
  const freelancersRef = useRef<HTMLDivElement>(null);
  const howWorkRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const statisticsRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const setupScrollAnimations = () => {
    // Partners bölümü animasyonu
    if (partnersRef.current) {
      // Tüm image elemanlarını seç
      const partnerImages = partnersRef.current.querySelectorAll('img');
      gsap.from(partnerImages, {
        scrollTrigger: {
          trigger: partnersRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.6
      });
    }
    
    // Freelancers bölümü animasyonu
    if (freelancersRef.current) {
      const elements = freelancersRef.current.querySelectorAll('h2, p, div > div');
      gsap.from(elements, {
        scrollTrigger: {
          trigger: freelancersRef.current,
          start: "top 70%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 40,
        stagger: 0.15,
        duration: 0.8
      });
    }
    
    // HowWork bölümü animasyonu
    if (howWorkRef.current) {
      const container = howWorkRef.current.querySelector('div');
      if (container) {
        // Ana içerik container'ını bulduktan sonra içindeki kartları seç
        const steps = container.querySelectorAll('div > div');
        gsap.from(steps, {
          scrollTrigger: {
            trigger: howWorkRef.current,
            start: "top 75%",
            toggleActions: "play none none none"
          },
          opacity: 0,
          x: (i) => i % 2 === 0 ? -40 : 40, // Alternatif yönlerden gelme
          stagger: 0.2,
          duration: 0.7,
          ease: "power2.out"
        });
      }
    }
    
    // Categories bölümü animasyonu
    if (categoriesRef.current) {
      // Önce başlık ve açıklama animasyonu
      const heading = categoriesRef.current.querySelector('h2');
      const subheading = categoriesRef.current.querySelector('p');
      
      if (heading || subheading) {
        gsap.from([heading, subheading].filter(Boolean), {
          scrollTrigger: {
            trigger: categoriesRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          },
          opacity: 0,
          y: 30,
          stagger: 0.1,
          duration: 0.5
        });
      }
      
      // Sonra kategori kartlarını animate et
      const container = categoriesRef.current.querySelector('div');
      if (container) {
        const categoryItems = container.querySelectorAll('div > div');
        gsap.from(categoryItems, {
          scrollTrigger: {
            trigger: categoriesRef.current,
            start: "top 65%",
            toggleActions: "play none none none"
          },
          opacity: 0,
          scale: 0.9,
          y: 20,
          stagger: 0.1,
          duration: 0.5,
          ease: "back.out(1.5)"
        });
      }
    }
    
    // Statistics bölümü animasyonu
    if (statisticsRef.current) {
      // İstatistik kartları
      const statItems = statisticsRef.current.querySelectorAll('div > div');
      gsap.from(statItems, {
        scrollTrigger: {
          trigger: statisticsRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 0.6
      });
      
      // Sayıların artma animasyonu - sayıları içeren elementleri seç
      const numberElements = statisticsRef.current.querySelectorAll('h2, h3');
      numberElements.forEach((el) => {
        const text = el.textContent || '';
        // Sadece sayı içeren metinleri işle
        if (/\d+/.test(text)) {
          const numericValue = parseInt(text.replace(/\D/g, ''), 10);
          if (!isNaN(numericValue)) {
            gsap.fromTo(el, 
              { textContent: '0' },
              {
                textContent: numericValue,
                duration: 2,
                ease: "power2.out",
                snap: { textContent: 1 },
                scrollTrigger: {
                  trigger: el,
                  start: "top 80%",
                }
              }
            );
          }
        }
      });
    }
    
    // Testimonials bölümü animasyonu
    if (testimonialsRef.current) {
      // Başlık animasyonu
      const heading = testimonialsRef.current.querySelector('h2');
      if (heading) {
        gsap.from(heading, {
          scrollTrigger: {
            trigger: testimonialsRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          },
          opacity: 0,
          y: 30,
          duration: 0.6
        });
      }
      
      // Testimonial kartları
      const container = testimonialsRef.current.querySelector('div > div');
      if (container) {
        const testimonialItems = container.children;
        gsap.from(testimonialItems, {
          scrollTrigger: {
            trigger: container,
            start: "top 75%",
            toggleActions: "play none none none"
          },
          opacity: 0,
          scale: 0.95,
          y: 40,
          stagger: 0.2,
          duration: 0.7,
          ease: "power3.out"
        });
      }
    }
    
    // Contact bölümü animasyonu
    if (contactRef.current) {
      const contactElements = contactRef.current.querySelectorAll('h2, p, form, input, textarea, button');
      gsap.from(contactElements, {
        scrollTrigger: {
          trigger: contactRef.current,
          start: "top 70%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out"
      });
    }
  };

  useEffect(() => {
    // Sayfa yüklendiğinde hero animasyonu
    if (heroRef.current) {
      const headings = heroRef.current.querySelectorAll('h1, h2');
      const paragraphs = heroRef.current.querySelectorAll('p');
      const buttons = heroRef.current.querySelectorAll('button, a');

      const tl = gsap.timeline();
      
      // Başlıkları animate et
      if (headings.length > 0) {
        tl.from(headings, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out"
        });
      }
      
      // Paragrafları animate et
      if (paragraphs.length > 0) {
        tl.from(paragraphs, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out"
        }, "-=0.4");
      }
      
      // Butonları animate et
      if (buttons.length > 0) {
        tl.from(buttons, {
          y: 20,
          opacity: 0,
          duration: 0.4,
          stagger: 0.1,
          ease: "power3.out"
        }, "-=0.3");
      }
    }
    
    // Scroll animasyonlarını başlat
    setupScrollAnimations();
    
    // Temizleme işlemi
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  

  return (
    <>
      <div ref={heroRef}>
        {heroData.length > 0 && <Hero data={heroData[0]} />}
      </div>
      
      <div>
        <Partners partners={partnerListData} />
      </div>
      
      {expertSectionData.length > 0 && (
        <div ref={freelancersRef}>
          <Freelancers data={expertSectionData[0]} />
        </div>
      )}
      
      <div ref={howWorkRef}>
        <HowWork data={howToWorkListData} />
      </div>
      
      <div ref={categoriesRef}>
        <Categories categories={categoriesListData} />
      </div>
      
      <div ref={statisticsRef}>
        <Statistics statistic={statisticListData} />
      </div>
      
      <div ref={testimonialsRef}>
        <Testimonials testimonials={getTestimonials} />
      </div>
      
      {heroData.length > 0 && (
        <div ref={contactRef}>
          <Contact data={contactSectionData[0]} />
        </div>
      )}
    </>
  );
};

export default HomePage;
