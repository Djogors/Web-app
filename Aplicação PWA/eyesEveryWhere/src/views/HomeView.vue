<script setup>
import '@/assets/homeView.css'
import navbarbeforelogin from '../components/Navbarbeforelogin.vue'
import background from '../components/icons/BackgroundImageComercialPage1.vue'
import background1 from '../components/icons/BackgroundAuditoryComercialPage.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules' /* Import modules */
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import report1 from '@/assets/report1.png'
import report2 from '@/assets/report2.png'
import report3 from '@/assets/report3.png'
import report4 from '@/assets/report4.png'
import report5 from '@/assets/report5.png'
import report6 from '@/assets/report6.png'

const images = [
  { src: report1, alt: 'Transito Congestionado' },
  { src: report2, alt: 'Falta de Sinalização' },
  { src: report3, alt: 'Passeio danificado' },
  { src: report4, alt: 'Estrada comprometida' },
  { src: report5, alt: 'Passeio sem luz' },
  { src: report6, alt: 'Sinalização danificada' },
]
</script>

<template>
  <navbarbeforelogin />
  <main>
    <background><p id="slogan">Keep Cities moving safely.</p></background>
    <swiper
      :slides-per-view="1"
      :space-between="20"
      :loop="true"
      :pagination="{ clickable: true }"
      :modules="[Pagination]"
    >
      <swiper-slide v-for="(image, index) in images" :key="index">
        <div class="image-container">
          <img class="image_res" :src="image.src" :alt="image.alt" />
          <div class="image-text">{{ image.alt }}</div>
        </div>
      </swiper-slide>
    </swiper>

    <div class="content-box">
      <h3 id="rep">Peritos</h3>
      <h5 id="rep">
        Trabalhamos para transformar a mobilidade urbana com soluções inteligentes e adaptadas às
        necessidades de cada cidade.
      </h5>

      <div class="background1-container">
        <!-- Background Component -->
        <background1 />
        <!-- Text Above Background -->
        <div class="text-overlay">
          <div class="horizontal-group">
            <h5 id="Auditory">Porque o nosso motivo é a sua segurança!</h5>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
