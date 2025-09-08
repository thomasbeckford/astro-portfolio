import React, { useState } from 'react'
import { Keyboard, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface DashboardProject {
  title: string
  description: string
  tools: string[]
  images: string[]
}

interface DashboardGalleryProps {
  projects: DashboardProject[]
}

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  project: DashboardProject | null
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  if (!isOpen || !project) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleEscapeKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm transition-all duration-300 ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      onClick={handleBackdropClick}
      onKeyDown={handleEscapeKey}
      tabIndex={-1}
    >
      <div
        className={`relative w-full max-w-6xl bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl transition-transform duration-300 ${
          isOpen ? 'scale-100' : 'scale-95'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h3 className="text-2xl font-bold text-white text-left">
              {project.title}
            </h3>
            <p className="text-gray-400 mt-1">{project.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 bg-gray-800 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Swiper Container */}
        <div className="p-6">
          <Swiper
            modules={[Navigation, Pagination, Keyboard]}
            slidesPerView={1}
            spaceBetween={30}
            loop={project.images.length > 1}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            keyboard={{
              enabled: true,
            }}
            className="dashboard-swiper"
          >
            {project.images.map((imageSrc, index) => (
              <SwiperSlide key={index}>
                <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    src={imageSrc}
                    alt={`${project.title} screenshot ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </SwiperSlide>
            ))}

            {/* Custom Navigation Buttons */}
            <div className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-gray-800/80 rounded-full border border-gray-600 hover:bg-gray-700 transition-colors flex items-center justify-center text-white cursor-pointer">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
            <div className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-gray-800/80 rounded-full border border-gray-600 hover:bg-gray-700 transition-colors flex items-center justify-center text-white cursor-pointer">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </div>
          </Swiper>
        </div>

        {/* Tech Stack */}
        <div className="px-6 pb-6">
          <div className="flex flex-wrap gap-2">
            {project.tools.map((tool, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-sm text-gray-300"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-swiper .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.5) !important;
          opacity: 1 !important;
        }

        .dashboard-swiper .swiper-pagination-bullet-active {
          background: #3b82f6 !important;
        }
      `}</style>
    </div>
  )
}

const DashboardCard: React.FC<{
  project: DashboardProject
  onClick: () => void
}> = ({ project, onClick }) => {
  return (
    <article className="group cursor-pointer">
      <div
        onClick={onClick}
        className="block relative border border-gray-800 rounded-xl p-8 hover:border-gray-700 transition-all duration-300 bg-gray-900/50 hover:bg-gray-900/70"
      >
        <div className="relative bg-gray-800 rounded-lg overflow-hidden mb-6 aspect-video">
          {/* Mostrar primera imagen */}
          <img
            src={project.images[0]}
            alt={`${project.title} screenshot`}
            className="opacity-80 group-hover:opacity-50 w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />

          {/* Images indicator */}
          {project.images.length > 1 && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-blue-500/20 border border-blue-500/30 rounded-full px-2 py-1">
              <svg
                className="w-3 h-3 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-xs text-blue-400 font-medium">
                {project.images.length}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-3 text-align-left ">
          <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-gray-100 transition-colors">
            {project.title}
          </h3>
          <p className="text-gray-400 group-hover:text-gray-300 leading-relaxed transition-colors">
            {project.description}
          </p>

          <div className="flex items-center gap-2 text-sm text-gray-500 group-hover:text-gray-400 transition-colors pt-2">
            <span>View gallery</span>
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </div>
        </div>

        <div className="absolute inset-0 rounded-xl ring-1 ring-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </article>
  )
}

const DashboardGallery: React.FC<DashboardGalleryProps> = ({
  projects,
}: {
  projects: DashboardProject[]
}) => {
  const [selectedProject, setSelectedProject] =
    useState<DashboardProject | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = (project: DashboardProject) => {
    setSelectedProject(project)
    setIsModalOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProject(null)
    document.body.style.overflow = 'auto'
  }

  // Handle ESC key globally
  React.useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal()
      }
    }

    document.addEventListener('keydown', handleEscapeKey)
    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = 'auto'
    }
  }, [isModalOpen])

  return (
    <>
      <section className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <DashboardCard
              key={index}
              project={project}
              onClick={() => openModal(project)}
            />
          ))}
        </div>
      </section>

      <ImageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        project={selectedProject}
      />
    </>
  )
}

export default DashboardGallery
