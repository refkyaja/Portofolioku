import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { 
  User, Code, GraduationCap, Mail, 
  Award, Image as ImageIcon, Moon, Sun, ChevronRight,
  Send, Cpu, Layout, Boxes, Menu, X
} from 'lucide-react';
import { FaGithub as Github, FaInstagram as Instagram, FaLinkedin as Linkedin } from 'react-icons/fa';
import * as THREE from 'three';

// --- DATA STATIS ---
const introWords = [
  "Halo", 
  "Selamat Datang", 
  "di", 
  "My Portofolio", 
  "Enjoy"
];

const roles = ["UI/UX Designer", "Web Developer", "Mobile Developer", "Fullstack Engineer"];

const sectionsData = [
  { id: 'home', label: 'Home', icon: <Layout size={18}/> },
  { id: 'about', label: 'About', icon: <User size={18}/> },
  { id: 'skills', label: 'Skills', icon: <Cpu size={18}/> },
  { id: 'projects', label: 'Projects', icon: <Code size={18}/> },
  { id: 'gallery', label: 'Gallery', icon: <ImageIcon size={18}/> },
  { id: 'education', label: 'Education', icon: <GraduationCap size={18}/> },
  { id: 'certs', label: 'Certificates', icon: <Award size={18}/> },
  { id: 'contact', label: 'Contact', icon: <Mail size={18}/> },
];

const techStack = [
  { name: 'Laravel', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg' },
  { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' },
  { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg' },
  { name: 'PHP', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg' },
  { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg' },
  { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' },
  { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg' },
  { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg' }
];

const myProjects = [
  {
    title: "Website TK PGRI Harapan Bangsa 1",
    desc: "Website sistem informasi sekolah dan PPDB online untuk membantu pengelolaan administrasi, data siswa, dan proses pendaftaran secara digital dan terstruktur.",
    tech: ["Laravel", "PHP", "MySQL", "Bootstrap"],
    img: "/images/project-ecommerce.jpg"
  },
  {
    title: "Aplikasi Catatan AI Pembelajaran",
    desc: "Aplikasi mobile untuk membantu siswa mencatat materi pembelajaran secara otomatis menggunakan teknologi AI dan speech-to-text.",
    tech: ["Flutter", "Dart", "Firebase", "AI Integration"],
    img: "/images/project-finance.jpg"
  },
  {
    title: "Website Pendataan MBG",
    desc: "Aplikasi pendataan ompreng MBG untuk mencatat proses pengambilan dan pengembalian secara digital agar lebih cepat dan terorganisir.",
    tech: ["Flutter", "Dart", "Firebase"],
    img: "/images/project-landing.jpg"
  }
];

const certificates = [
  {
    title: "Dicoding: Belajar dasar Aws Cloud",
    issuer: "Dicoding Indonesia",
    img: "/images/cert-google.jpg"
  },
  {
    title: "Dicoding: Pemrograman JavaScript (Dasar)",
    issuer: "Dicoding Indonesia",
    img: "/images/cert-laravel.jpg"
  },
  {
    title: "AWS Academy Cloud Foundations",
    issuer: "Amazon Web Services (AWS)",
    img: "/images/cert-frontend.jpg"
  }
];

const educationData = [
  { 
    year: '2023 – Sekarang', 
    school: 'SMKN 13 Bandung', 
    degree: 'Jurusan Rekayasa Perangkat Lunak'
  },
  { 
    year: '2020 – 2023', 
    school: 'MTSN 2 Kota Bandung', 
    degree: 'Sekolah Menengah Pertama'
  },
  { 
    year: '2014 – 2020', 
    school: 'SDN 161 Sukapura', 
    degree: 'Sekolah Dasar'
  }
];

// --- KOMPONEN KUBUS 3D ---
const WireframeCube3D = ({ step, isIntroActive }) => {
  const containerRef = useRef(null);
  const mountRefBase = useRef(null);
  const mountRefOverlay = useRef(null);
  const mousePosRef = useRef({ x: -1000, y: -1000 });
  const isHoveredRef = useRef(false);
  
  // Ref untuk melacak perubahan step agar kubus merespons (berputar) tiap diklik
  const stepRef = useRef(step);
  const isIntroActiveRef = useRef(isIntroActive);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  useEffect(() => {
    isIntroActiveRef.current = isIntroActive;
  }, [isIntroActive]);

  useEffect(() => {
    let frameId;
    const size = 600; 
    const numBlobs = 5;
    const blobs = Array(numBlobs).fill(0).map(() => ({ x: size/2, y: size/2, size: 0 }));

    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 3.8; 

    const sceneBase = new THREE.Scene();
    const rendererBase = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererBase.setSize(size, size);
    rendererBase.domElement.style.width = '100%';
    rendererBase.domElement.style.height = '100%';
    if (mountRefBase.current) mountRefBase.current.appendChild(rendererBase.domElement);

    const geoBase = new THREE.BoxGeometry(2.4, 2.4, 2.4);
    const matBase = new THREE.LineBasicMaterial({ color: 0xa855f7, linewidth: 2, transparent: true, opacity: 0.8 });
    const wireBase = new THREE.LineSegments(new THREE.EdgesGeometry(geoBase), matBase);
    sceneBase.add(wireBase);

    const geoInner = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const matInner = new THREE.LineBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.4 });
    const wireInner = new THREE.LineSegments(new THREE.EdgesGeometry(geoInner), matInner);
    sceneBase.add(wireInner);

    const sceneOverlay = new THREE.Scene();
    const rendererOverlay = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererOverlay.setSize(size, size);
    rendererOverlay.domElement.style.width = '100%';
    rendererOverlay.domElement.style.height = '100%';
    if (mountRefOverlay.current) mountRefOverlay.current.appendChild(rendererOverlay.domElement);

    const texLoader = new THREE.TextureLoader();
    const texture = texLoader.load('/images/foto-about-me.jpg'); 
    
    const matOverlay = new THREE.MeshBasicMaterial({ map: texture, color: 0xffffff });
    const meshOverlay = new THREE.Mesh(geoBase, matOverlay);
    sceneOverlay.add(meshOverlay);

    let currentOffset = 0; // Offset rotasi untuk efek lonjakan saat klik

    const animate = () => {
      // 1. Logika Rotasi: Berputar lambat secara default, melompat 90 derajat tiap klik
      const targetOffset = stepRef.current * (Math.PI / 2); // Tiap step tambah 90 derajat
      currentOffset += (targetOffset - currentOffset) * 0.05; // Lerp untuk transisi mulus

      const time = Date.now() * 0.0015; 
      
      wireBase.rotation.x = time * 0.5 + currentOffset * 0.5;
      wireBase.rotation.y = time * 0.8 + currentOffset;
      
      wireInner.rotation.x = -time * 0.5 - currentOffset * 0.5;
      wireInner.rotation.y = -time * 0.8 - currentOffset;
      
      meshOverlay.rotation.x = wireBase.rotation.x;
      meshOverlay.rotation.y = wireBase.rotation.y;

      rendererBase.render(sceneBase, camera);
      rendererOverlay.render(sceneOverlay, camera);
      
      // 2. Logika Gelembung Abstrak (Liquid Masking)
      const cx = size / 2; 
      const cy = size / 2; 

      let targets = [];

      if (isHoveredRef.current) {
        const mx = mousePosRef.current.x;
        const my = mousePosRef.current.y;
        targets = [
          { x: mx + Math.sin(time*5)*40, y: my + Math.cos(time*4)*30, size: 100 + Math.sin(time*3)*30 },
          { x: mx + Math.cos(time*3.5)*50, y: my + Math.sin(time*4.5)*40, size: 120 + Math.cos(time*2)*40 },
          { x: mx + Math.sin(time*4)*30, y: my + Math.cos(time*3.5)*50, size: 110 + Math.sin(time*4)*20 },
          { x: mx - Math.cos(time*3)*40, y: my - Math.sin(time*4)*30, size: 90 + Math.cos(time*3)*30 },
          { x: mx, y: my, size: 80 + Math.sin(time*5)*20 } 
        ];
      } else {
        const cycleTime = Date.now() % 8000; 
        let popMultiplier = 0;
        if (cycleTime < 2500) {
          popMultiplier = Math.sin((cycleTime / 2500) * Math.PI); 
        }
        targets = [
          { x: cx + Math.sin(time * 0.7) * 200, y: cy + Math.cos(time * 0.5) * 150, size: (150 + Math.sin(time * 1.2) * 150) * popMultiplier },
          { x: cx + Math.cos(time * 0.4 + 2) * 180, y: cy + Math.sin(time * 0.6 + 1) * 200, size: (180 + Math.cos(time * 0.9) * 180) * popMultiplier },
          { x: cx + Math.sin(time * 0.8 + 4) * 220, y: cy + Math.cos(time * 0.3 + 3) * 180, size: (160 + Math.sin(time * 1.5 + 2) * 160) * popMultiplier },
          { x: cx + Math.cos(time * 0.5 + 1) * 150, y: cy + Math.sin(time * 0.8 + 5) * 220, size: (200 + Math.cos(time * 1.1) * 200) * popMultiplier },
          { x: cx + Math.sin(time * 0.6 + 3) * 250, y: cy + Math.cos(time * 0.7 + 2) * 250, size: (220 + Math.sin(time * 0.8 + 1) * 220) * popMultiplier }
        ];
      }

      let maskStyleParts = [];
      for (let i = 0; i < numBlobs; i++) {
        blobs[i].x += (targets[i].x - blobs[i].x) * 0.05;
        blobs[i].y += (targets[i].y - blobs[i].y) * 0.05;
        blobs[i].size += (targets[i].size - blobs[i].size) * 0.05;

        const s = Math.max(0, blobs[i].size);
        maskStyleParts.push(`radial-gradient(circle ${s}px at ${blobs[i].x}px ${blobs[i].y}px, black 45%, transparent 65%)`);
      }

      if (mountRefOverlay.current) {
        if (isIntroActiveRef.current) {
          // Sembunyikan foto sepenuhnya saat Intro
          mountRefOverlay.current.style.opacity = "0";
        } else {
          // Tampilkan dengan efek gelembung cairan di halaman utama
          const maskStyle = maskStyleParts.join(', ');
          mountRefOverlay.current.style.WebkitMaskImage = maskStyle;
          mountRefOverlay.current.style.maskImage = maskStyle;
          mountRefOverlay.current.style.opacity = "1"; 
        }
      }

      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      if (rendererBase && rendererBase.domElement) rendererBase.domElement.remove();
      if (rendererOverlay && rendererOverlay.domElement) rendererOverlay.domElement.remove();
      rendererBase.dispose();
      rendererOverlay.dispose();
    };
  }, []);

  const handleMouseMove = (e) => {
    if(!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mousePosRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    isHoveredRef.current = true;
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-[350px] h-[350px] md:w-[600px] md:h-[600px] flex items-center justify-center cursor-crosshair overflow-visible"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={mountRefBase} className="absolute inset-0 pointer-events-none drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
      <div ref={mountRefOverlay} className="absolute inset-0 pointer-events-none drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]" />
    </div>
  );
};

const Typewriter = ({ words }) => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    let timer = setTimeout(() => {
      const i = loopNum % words.length;
      const fullText = words[i];

      if (isDeleting) {
        setText(fullText.substring(0, text.length - 1));
        setTypingSpeed(75);
      } else {
        setText(fullText.substring(0, text.length + 1));
        setTypingSpeed(150);
      }

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 5000); 
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    }, typingSpeed, text, isDeleting, loopNum, words);

    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, words, typingSpeed]);

  return (
    <span className="text-purple-400 font-semibold border-r-2 border-purple-400 pr-1 animate-[pulse_1s_infinite]">
      {text}
    </span>
  );
};

export default function App() {
  const [introStep, setIntroStep] = useState(0);
  const [isIntroActive, setIsIntroActive] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [darkMode, setDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [formEmail, setFormEmail] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Cegah scroll layar saat Intro belum selesai
  useEffect(() => {
    if (isIntroActive) {
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isIntroActive]);

  useEffect(() => {
    const handleScroll = () => {
      if(isIntroActive) return;
      const sectionIds = ['home', 'about', 'skills', 'projects', 'gallery', 'education', 'certs', 'contact'];
      const scrollPosition = window.scrollY + (window.innerHeight / 3);

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isIntroActive]);

  const handleIntroClick = () => {
    if (introStep < introWords.length - 1) {
      setIntroStep(prev => prev + 1);
    } else {
      setIsIntroActive(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!formEmail || !formMessage) return;
    const subject = encodeURIComponent("Pesan dari Portfolio Website");
    const body = encodeURIComponent(`Email Pengirim: ${formEmail}\n\nPesan:\n${formMessage}`);
    window.location.href = `mailto:refkyfm2012@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className={`${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} transition-colors duration-500 min-h-screen font-sans selection:bg-purple-500/30 overflow-x-hidden`}>
      
      {/* Background Animasi - Selalu Berjalan */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full ${darkMode ? 'bg-purple-900/20' : 'bg-purple-200/40'} blur-[120px] animate-pulse`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full ${darkMode ? 'bg-blue-900/20' : 'bg-blue-200/40'} blur-[120px] animate-pulse`} style={{ animationDelay: '3s' }} />
        <div className={`absolute inset-0 ${darkMode ? 'bg-[radial-gradient(#ffffff_1px,transparent_1px)]' : 'bg-[radial-gradient(#000000_1px,transparent_1px)]'} [background-size:32px_32px] opacity-[0.03]`} />
      </div>

      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 z-[100] origin-left" style={{ scaleX }} />

      {/* OVERLAY INTRO (Lapisan transparan penangkap klik) */}
      <AnimatePresence>
        {isIntroActive && (
          <motion.div
            key="intro-overlay"
            className="fixed inset-0 z-[100] flex flex-col justify-center px-10 md:px-24 cursor-pointer"
            onClick={handleIntroClick}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Teks Intro Sebelah Kiri */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={introStep}
                initial={
                  introStep % 4 === 0 ? { opacity: 0, x: -50 } :
                  introStep % 4 === 1 ? { opacity: 0, y: 50 } :
                  introStep % 4 === 2 ? { opacity: 0, x: 50 } :
                  { opacity: 0, y: -50 }
                }
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={
                  introStep % 4 === 0 ? { opacity: 0, x: 50 } :
                  introStep % 4 === 1 ? { opacity: 0, y: -50 } :
                  introStep % 4 === 2 ? { opacity: 0, x: -50 } :
                  { opacity: 0, y: 50 }
                }
                transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
                className="text-4xl md:text-6xl lg:text-7xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 w-full md:max-w-3xl drop-shadow-[0_0_15px_rgba(168,85,247,0.3)] leading-tight"
              >
                {introWords[introStep]}
              </motion.h1>
            </AnimatePresence>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-12 left-10 md:left-24 text-purple-400/80 font-mono text-sm tracking-widest animate-pulse"
            >
              [ KLIK LAYAR UNTUK MELANJUTKAN ]
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation (Desktop) - Disembunyikan di Mobile */}
      <nav className={`hidden md:flex fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-50 px-2 md:px-4 py-2 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 items-center gap-1 shadow-2xl overflow-x-auto w-[calc(100vw-2rem)] md:w-max max-w-full [&::-webkit-scrollbar]:hidden transition-all duration-[1.5s] delay-300 ${isIntroActive ? 'opacity-0 translate-y-20 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
        {sectionsData.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              setActiveSection(s.id);
              document.getElementById(s.id).scrollIntoView({ behavior: 'smooth' });
            }}
            className={`p-3 rounded-2xl transition-all duration-300 flex items-center gap-2 shrink-0 ${activeSection === s.id ? 'bg-purple-500/20 text-purple-400 ring-1 ring-purple-500/50' : 'hover:bg-white/5 opacity-60 hover:opacity-100'}`}
          >
            {s.icon}
            <span className={`text-xs font-medium hidden md:block ${activeSection === s.id ? 'block' : 'hidden'}`}>{s.label}</span>
          </button>
        ))}
        <div className="w-[1px] h-6 bg-white/10 mx-2 shrink-0" />
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-3 rounded-2xl hover:bg-white/5 transition-all shrink-0"
        >
          {darkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-slate-600" />}
        </button>
      </nav>

      {/* Navigation (Mobile) - Hamburger Menu Bergaya Kapsul */}
      <nav className={`md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4 transition-all duration-[1.5s] delay-300 w-[calc(100vw-4rem)] max-w-[300px] ${isIntroActive ? 'opacity-0 translate-y-20 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="flex flex-col w-full max-h-[60vh] overflow-y-auto bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] p-2 shadow-2xl [&::-webkit-scrollbar]:hidden"
            >
              {sectionsData.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveSection(s.id);
                    setIsMobileMenuOpen(false);
                    document.getElementById(s.id).scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`p-4 rounded-2xl transition-all duration-300 flex items-center gap-4 ${activeSection === s.id ? 'bg-purple-500/20 text-purple-400' : 'hover:bg-white/5'}`}
                >
                  {s.icon}
                  <span className="text-sm font-medium">{s.label}</span>
                </button>
              ))}
              <div className="h-[1px] w-full bg-white/10 my-2" />
              <button 
                onClick={() => { setDarkMode(!darkMode); setIsMobileMenuOpen(false); }}
                className="p-4 rounded-2xl flex items-center gap-4 hover:bg-white/5"
              >
                {darkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}
                <span className="text-sm font-medium">{darkMode ? "Light Mode" : "Dark Mode"}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Control Pill (Menu Utama) */}
        <div className="w-full bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full p-2 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-3 pl-4">
            <span className="text-purple-400">
              {sectionsData.find(s => s.id === activeSection)?.icon}
            </span>
            <span className="font-bold text-sm text-purple-400 tracking-wider uppercase">
              {sectionsData.find(s => s.id === activeSection)?.label}
            </span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="home" className="relative min-h-screen flex flex-col-reverse md:flex-row items-center justify-center px-6 md:px-20 gap-10 overflow-hidden py-24 md:py-0">
        
        {/* Teks Profil (Sembunyi saat Intro) */}
        <div className={`flex-1 text-center md:text-left z-10 transition-all duration-[1.5s] ease-out ${isIntroActive ? 'opacity-0 translate-x-[-50px] pointer-events-none' : 'opacity-100 translate-x-0 delay-300'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            STATUS: ACTIVE & CREATING
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-slate-300 mb-2 tracking-wide">
            Hii, I'M
          </h2>
          <h1 className="text-5xl md:text-8xl font-black mb-4 tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400">
            Refky Favian Mahardika
          </h1>
          <div className="text-2xl md:text-4xl font-light text-slate-300 mb-10 h-10">
            <Typewriter words={roles} />
          </div>

          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <button 
              onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all flex items-center gap-2 group"
            >
              view project <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Kubus 3D Container (Berubah posisi & ukuran saat Intro selesai) */}
        {/* Di mode Intro: Kubus dibesarkan (scale-150) dan digeser ke kanan (translate-x-[40%]) agar hanya setengahnya yang terlihat di layar. Saat selesai, kubus akan kembali ke posisi normal. */}
        <div className={`flex-1 flex justify-center items-center relative mt-10 md:mt-0 transition-all duration-[1.5s] ease-[cubic-bezier(0.76,0,0.24,1)] ${isIntroActive ? 'scale-[1.5] translate-x-[20%] md:translate-x-[40%] translate-y-[10%] md:translate-y-0 opacity-50 md:opacity-100' : 'scale-100 translate-x-0 translate-y-0 opacity-100'}`}>
          <WireframeCube3D step={introStep} isIntroActive={isIntroActive} />
        </div>

        {/* Scroll Indicator (Sembunyi saat Intro) */}
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className={`absolute bottom-12 left-1/2 -translate-x-1/2 flex-col items-center hidden md:flex transition-all duration-1000 delay-700 ${isIntroActive ? 'opacity-0 pointer-events-none' : 'opacity-50'}`}
        >
          <span className="text-[10px] tracking-[0.3em] font-mono mb-3 text-purple-400">SCROLL</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-purple-500 to-transparent" />
        </motion.div>
      </section>

      {/* --- SECTIONS LAINNYA --- */}
      {/* Semua section dibungkus div yang disembunyikan saat Intro agar scroll tidak bocor ke bawah */}
      <div className={`transition-opacity duration-1000 ${isIntroActive ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto'}`}>
        {/* ABOUT SECTION */}
        <section id="about" className="py-24 px-6 md:px-20 border-t border-white/5 overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="w-full md:w-1/2 group"
              >
                <div className="relative aspect-square rounded-[2.5rem] overflow-hidden border border-white/10">
                  <img 
                    src="/images/foto-about-me.jpg" 
                    alt="Profile" 
                    className="w-full h-full object-cover object-top grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-full md:w-1/2"
              >
                <h3 className="text-4xl font-bold mb-8">About me</h3>
                <p className="text-lg text-slate-400 leading-relaxed mb-4">
                  Halo! Saya seorang siswa SMK jurusan Rekayasa Perangkat Lunak yang memiliki ketertarikan besar di dunia pengembangan web dan mobile app. Saya senang membangun aplikasi yang tidak hanya berfungsi dengan baik, tetapi juga nyaman digunakan. Fokus saya saat ini adalah mempelajari dan mengembangkan project menggunakan Laravel, Flutter, dan teknologi modern lainnya.
                </p>
                <p className="text-lg text-slate-400 leading-relaxed mb-8">
                  Bagi saya, coding bukan cuma sekedar code/syntax, tapi tentang bagaimana ide bisa berubah menjadi sesuatu yang berguna.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Personal Projects', val: '24+' },
                    { label: 'Skills', val: 'Frontend & Backend' },
                  ].map((stat, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 + (i * 0.1) }}
                      className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition-colors flex flex-col justify-center items-center text-center h-full"
                    >
                      <p className="text-xs text-slate-500 uppercase mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-white">{stat.val}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" className="py-24 px-6 bg-slate-900/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold">Tech Stack & Tools</h3>
              <p className="text-slate-400 mt-4">Teknologi yang saya gunakan untuk membangun Web & Aplikasi.</p>
            </div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
              }}
              className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-6"
            >
              {techStack.map((tech, i) => (
                <motion.div 
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ y: -10, scale: 1.1 }}
                  className="flex flex-col items-center justify-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-colors cursor-pointer group"
                >
                  <img 
                    src={tech.icon} 
                    alt={tech.name} 
                    className="w-12 h-12 object-contain filter drop-shadow-lg group-hover:drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all"
                  />
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{tech.name}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="mb-16"
            >
              <h3 className="text-4xl font-bold">My Projects</h3>
              <p className="text-slate-400 mt-4">Beberapa karya yang telah saya bangun.</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {myProjects.map((proj, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group rounded-3xl bg-white/5 border border-white/10 overflow-hidden hover:border-purple-500/40 transition-all flex flex-col"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img src={proj.img} alt={proj.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h4 className="text-xl font-bold mb-3">{proj.title}</h4>
                    <p className="text-slate-400 text-sm mb-6 flex-1">{proj.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {proj.tech.map((t, idx) => (
                        <span key={idx} className="px-3 py-1 text-xs rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* GALLERY SECTION */}
        <section id="gallery" className="py-24 px-6 bg-white/5">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
            >
              <div>
                <h3 className="text-4xl font-bold">Gallery & Moments</h3>
              </div>
              <p className="text-slate-400 max-w-xs text-sm">Beberapa tangkapan lensa di sela-sela waktu coding dan eksplorasi.</p>
            </motion.div>
            <div className="columns-1 md:columns-3 gap-6 space-y-6">
              {[
                "/images/gallery-1.jpg",
                "/images/gallery-2.jpg",
                "/images/gallery-3.jpg",
                "/images/gallery-4.jpg",
                "/images/gallery-5.jpg",
                "/images/gallery-6.jpg"
              ].map((img, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="relative overflow-hidden rounded-3xl border border-white/5 cursor-pointer group"
                >
                  <img src={img} className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Gallery item" />
                  <div className="absolute inset-0 bg-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="p-3 bg-white text-black rounded-full scale-0 group-hover:scale-100 transition-transform duration-500">
                      <ImageIcon size={20} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* EDUCATION SECTION */}
        <section id="education" className="py-24 px-6 border-t border-white/5">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="mb-16 text-center"
            >
              <h3 className="text-4xl font-bold">Riwayat Pendidikan</h3>
              <p className="text-slate-400 mt-4">Perjalanan akademis yang membentuk pola pikir saya.</p>
            </motion.div>
            
            <div className="relative border-l-2 border-purple-900/50 ml-4 md:ml-8 space-y-12 overflow-hidden py-2">
              {educationData.map((edu, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  className="relative pl-8 md:pl-12"
                >
                  {/* Node Dot Timeline (Titik Bercahaya) */}
                  <div className="absolute -left-[11px] top-1.5 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-slate-950 border-2 border-purple-500 flex items-center justify-center ring-4 ring-slate-950">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></div>
                    </div>
                  </div>

                  {/* Card Container */}
                  <div className="bg-slate-900/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 md:p-8 hover:border-purple-500/50 transition-all duration-300 shadow-lg hover:shadow-purple-500/10 group">
                    <span className="text-xs md:text-sm font-mono text-purple-400 mb-2 block tracking-wider">{edu.year}</span>
                    <h4 className="text-xl md:text-2xl font-bold text-white tracking-wide mb-1">{edu.school}</h4>
                    <p className="text-slate-300 text-sm md:text-base font-medium">{edu.degree}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CERTIFICATES SECTION */}
        <section id="certs" className="py-24 px-6 bg-slate-900/30">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="mb-16 text-center"
            >
              <h3 className="text-4xl font-bold">Sertifikasi & Penghargaan</h3>
              <p className="text-slate-400 mt-4">Bukti validasi keahlian dari institusi terpercaya.</p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {certificates.map((cert, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  whileHover={{ y: -5 }}
                  className="rounded-3xl bg-white/5 border border-white/10 overflow-hidden group cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img src={cert.img} alt={cert.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white/80 group-hover:bg-purple-500 group-hover:text-white transition-all">
                      <Award size={20} />
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-lg font-bold mb-1 leading-snug">{cert.title}</h4>
                    <p className="text-purple-400 text-sm">{cert.issuer}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="py-24 px-6 border-t border-white/5">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto rounded-[3rem] bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 p-12 md:p-24 relative overflow-hidden text-center"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] -z-10" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Let's build the <span className="text-purple-400 underline decoration-purple-500/30">future</span> together.</h2>
            <p className="text-slate-400 mb-12 max-w-md mx-auto">Tersedia untuk kolaborasi atau sekadar diskusi teknologi. Jangan ragu untuk menyapa!</p>
            
            <form className="max-w-md mx-auto space-y-4 mb-12" onSubmit={handleSendMessage}>
              <input 
                type="email" 
                placeholder="Your Email" 
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                required
                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:border-purple-500 transition-all text-white placeholder-slate-500" 
              />
              <textarea 
                placeholder="Message" 
                value={formMessage}
                onChange={(e) => setFormMessage(e.target.value)}
                required
                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 h-32 focus:outline-none focus:border-purple-500 transition-all text-white placeholder-slate-500" 
              />
              <button type="submit" className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-transform active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20">
                Send Message <Send size={18} />
              </button>
            </form>

            <div className="flex justify-center gap-8 border-t border-white/5 pt-12">
              {[
                { Icon: Instagram, link: "https://www.instagram.com/refkyyfm?igsh=OHRkeXdyOTl3NTlm" },
                { Icon: Github, link: "https://github.com/refkyaja" },
                { Icon: Mail, link: "mailto:refkyfm2012@gmail.com" }
              ].map(({ Icon, link }, i) => (
                <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors hover:scale-110">
                  <Icon size={24} />
                </a>
              ))}
            </div>
          </motion.div>
        </section>

        {/* FOOTER */}
        <footer className="py-12 text-center text-slate-600 text-sm pb-32 md:pb-12 border-t border-white/5">
          <p>© {new Date().getFullYear()} — Handcrafted by <span className="text-slate-400">Refky Favian Mahardika</span></p>
        </footer>
      </div>

    </div>
  );
}
