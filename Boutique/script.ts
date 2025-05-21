// Interfaces
interface CarouselOptions {
    container: HTMLElement;
    prevBtn: HTMLElement;
    nextBtn: HTMLElement;
    scrollItems: number;
    scrollAmount: number;
}

// Clase para manejar el carrusel de productos
class ProductCarousel {
    private container: HTMLElement;
    private prevBtn: HTMLElement;
    private nextBtn: HTMLElement;
    private scrollItems: number;
    private scrollAmount: number;
    private currentPosition: number = 0;
    private maxScroll: number = 0;

    constructor(options: CarouselOptions) {
        this.container = options.container;
        this.prevBtn = options.prevBtn;
        this.nextBtn = options.nextBtn;
        this.scrollItems = options.scrollItems;
        this.scrollAmount = options.scrollAmount;
        
        this.init();
    }

    private init(): void {
        // Calcular el ancho máximo que se puede desplazar
        const containerWidth = this.container.scrollWidth;
        const visibleWidth = this.container.clientWidth;
        this.maxScroll = containerWidth - visibleWidth;

        // Event listeners para los botones
        this.prevBtn.addEventListener('click', () => this.scrollPrev());
        this.nextBtn.addEventListener('click', () => this.scrollNext());

        // Verificar estado inicial de los botones
        this.updateButtonStates();

        // Agregar listener para manejar cambios de tamaño de ventana
        window.addEventListener('resize', () => {
            this.maxScroll = this.container.scrollWidth - this.container.clientWidth;
            this.updateButtonStates();
        });
    }

    private scrollNext(): void {
        const newPosition = Math.min(this.currentPosition + this.scrollAmount, this.maxScroll);
        this.scrollTo(newPosition);
    }

    private scrollPrev(): void {
        const newPosition = Math.max(this.currentPosition - this.scrollAmount, 0);
        this.scrollTo(newPosition);
    }

    private scrollTo(position: number): void {
        this.currentPosition = position;
        this.container.scrollTo({
            left: this.currentPosition,
            behavior: 'smooth'
        });
        
        // Actualizar estado de los botones después del desplazamiento
        setTimeout(() => this.updateButtonStates(), 300);
    }

    private updateButtonStates(): void {
        // Deshabilitar el botón anterior si estamos al inicio
        this.prevBtn.style.opacity = this.currentPosition <= 0 ? '0.5' : '1';
        this.prevBtn.style.cursor = this.currentPosition <= 0 ? 'default' : 'pointer';
        
        // Deshabilitar el botón siguiente si estamos al final
        this.nextBtn.style.opacity = this.currentPosition >= this.maxScroll ? '0.5' : '1';
        this.nextBtn.style.cursor = this.currentPosition >= this.maxScroll ? 'default' : 'pointer';
    }
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    // Obtener referencias a los elementos del carrusel
    const carouselContainer = document.querySelector('.product-carousel') as HTMLElement;
    const prevButton = document.getElementById('prevBtn') as HTMLElement;
    const nextButton = document.getElementById('nextBtn') as HTMLElement;

    if (carouselContainer && prevButton && nextButton) {
        // Calcular el ancho aproximado de cada elemento para determinar cuánto desplazar
        const itemWidth = carouselContainer.clientWidth / 5; // 5 elementos visibles en escritorio
        
        // Inicializar el carrusel
        const productCarousel = new ProductCarousel({
            container: carouselContainer,
            prevBtn: prevButton,
            nextBtn: nextButton,
            scrollItems: 1, // Desplazar 1 elemento a la vez
            scrollAmount: itemWidth // Desplazar el ancho de un elemento
        });
    }
});