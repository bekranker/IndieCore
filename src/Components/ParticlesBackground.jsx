import React, { useEffect } from "react";
import "./ParticlesBackground.css";

const ParticlesBackground = () => {
  useEffect(() => {
    const canvas = document.getElementById("particles");
    const ctx = canvas.getContext("2d");

    let particlesArray = [];
    const maxParticles = 100; // Maksimum partikül sayısı
    const lineDistance = 300; // Çizgilerin bağlanması için mesafe
    const particleSpawnInterval = 10; // Partiküllerin ne kadar aralıklarla doğacağı

    // Ekran boyutlarına göre canvas'ı ayarla
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Partiküllerin oluşturulması
    function createParticles() {
      if (particlesArray.length < maxParticles) {
        particlesArray.push(new Particle());
      }
    }

    // Partikül Sınıfı
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 2;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = "rgba(255, 255, 255, 0.6)";
        this.alpha = Math.random() * 0.3 + 0.1; // Hafif şeffaflık
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > 0.2) this.size -= 0.05; // Zamanla küçülür

        // Canvas sınırlarına ulaşınca karşıt yönde hareket eder
        if (this.x <= 0 || this.x >= canvas.width) this.speedX *= -1;
        if (this.y <= 0 || this.y >= canvas.height) this.speedY *= -1;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Çizgilerin oluşturulması
    function connectParticles() {
      for (let i = 0; i < particlesArray.length; i++) {
        for (let j = i; j < particlesArray.length; j++) {
          let dx = particlesArray[i].x - particlesArray[j].x;
          let dy = particlesArray[i].y - particlesArray[j].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < lineDistance) {
            ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
            ctx.stroke();
          }
        }
      }
    }

    // Animasyon Fonksiyonu
    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesArray.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      connectParticles();

      requestAnimationFrame(animateParticles);
    }

    // Partiküllerin düzenli olarak doğması
    setInterval(createParticles, particleSpawnInterval);

    // Animasyonu başlat
    animateParticles();

    // Temizlik
    return () => {
      // Burada herhangi bir cleanup işlemi yapılabilir
    };
  }, []);

  return (
    <div className="particles-container">
      <canvas id="particles"></canvas>
    </div>
  );
};

export default ParticlesBackground;
