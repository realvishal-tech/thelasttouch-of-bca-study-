/**
 * BCA STORE - Computer Architecture & Organization Knowledge Base
 * Training dataset for the AI Assistant.
 */

const ARCHITECTURE_KNOWLEDGE = {
  // Core CPU Concepts
  "computer architecture": "The conceptual design and fundamental operational structure of a computer system.",
  "cpu components": "Consists of the Arithmetic Logic Unit (ALU), Control Unit (CU), and Registers.",
  "microprocessor": "A central processing unit (CPU) contained on a single integrated circuit chip.",
  "multi-core processor": "A single computing component with two or more independent actual processing units (cores).",
  "instruction set architecture": "The part of the computer architecture related to programming, including data types, instructions, and registers.",
  "opcode and operand": "Opcode is the command (e.g., ADD), and Operand is the data or location the command acts upon.",

  // Registers & Memory Hierarchy
  "cpu registers": "Small, extremely fast storage locations within the CPU used to hold data currently being processed.",
  "program counter": "A register that contains the address of the next instruction to be executed.",
  "accumulator": "A register where intermediate arithmetic and logic results are stored.",
  "cache memory": "A small, high-speed memory area between the CPU and RAM that stores frequently accessed data.",
  "l1 l2 l3 cache": "L1 is the fastest and smallest (internal to CPU), L2 is larger, and L3 is shared across all cores.",
  "virtual memory": "A memory management technique that uses hardware and software to allow a computer to compensate for physical memory shortages.",

  // Buses & Communication
  "system bus": "The communication path that connects the CPU, memory, and I/O devices. Includes Address, Data, and Control buses.",
  "address bus": "Transfers the memory address of the data being accessed.",
  "data bus": "Transfers the actual data between components.",
  "control bus": "Transfers control signals (like read/write) from the CU to other parts.",

  // I/O & Interrupts
  "direct memory access": "DMA allows certain hardware subsystems to access main system memory independently of the CPU.",
  "interrupt": "A signal to the processor emitted by hardware or software indicating an event that needs immediate attention.",
  "polling": "The process where the CPU periodically checks the status of a peripheral device to see if it needs service.",

  // Architecture Types
  "von neumann architecture": "A design where program instructions and data are stored in the same memory.",
  "harvard architecture": "A design that uses separate memory and buses for instructions and data.",
  "risc vs cisc": "RISC (Reduced Instruction Set) uses simple instructions for speed; CISC (Complex Instruction Set) uses multi-step complex instructions.",

  // Pipelining & Performance
  "instruction pipelining": "A technique used to improve throughput by overlapping the execution of multiple instructions.",
  "machine cycle": "The basic operation cycle of a CPU: Fetch, Decode, Execute, and Store.",
  "clock speed": "The rate at which a processor executes instructions, measured in GHz (Gigahertz).",

  // Storage & Peripherals
  "raid levels": "Redundant Array of Independent Disks; methods like RAID 0 (striping), RAID 1 (mirroring), and RAID 5 (parity) for data safety.",
  "smps": "Switched Mode Power Supply; the component that converts wall power to usable DC power for the computer.",

  // 400 Computer Architecture Questions
  "what is cpu": "The Central Processing Unit; the brain of the computer that carries out instructions of a computer program.",
  "what is alu": "The Arithmetic Logic Unit; performs arithmetic (add, subtract) and logical (AND, OR) operations.",
  "what is control unit": "The part of the CPU that directs the operation of the processor and coordinates other components.",
  "what is a processor core": "An independent processing unit within a CPU that can execute instructions individually.",
  "opcode": "Operation code; the portion of a machine language instruction that specifies the operation to be performed.",
  "operand": "The part of an instruction that specifies what data is to be manipulated or operated on.",
  "accumulator register": "A specialized register that stores intermediate arithmetic and logic results.",
  "instruction register": "A register that holds the current instruction being executed or decoded.",
  "mar": "Memory Address Register; holds the memory address from which data will be fetched or to which data will be sent.",
  "mdr": "Memory Data Register; holds the data that is either being read from or written to memory.",
  "ram": "Random Access Memory; volatile memory used to store data and machine code currently in use.",
  "rom": "Read Only Memory; non-volatile memory that stores the permanent start-up instructions (firmware).",
  "cache memory": "High-speed memory located near the CPU to reduce the average time to access data from main memory.",
  "primary memory": "The main memory of the computer (RAM) that the CPU can access directly.",
  "secondary memory": "Permanent storage devices like Hard Disks or SSDs that are not directly accessible by the CPU.",
  "virtual memory": "A feature of an OS that allows it to use hard disk space as additional RAM.",
  "sram": "Static RAM; faster and more expensive RAM that doesn't need refreshing (used in Cache).",
  "dram": "Dynamic RAM; slower and cheaper RAM that needs to be refreshed thousands of times per second.",
  "memory hierarchy": "The organization of storage levels from fastest (registers/cache) to slowest (secondary storage).",
  "memory fragmentation": "A phenomenon in which storage space is used inefficiently, reducing capacity or performance.",
  "address bus": "A set of wires used by the CPU to send the memory address of data it wants to access.",
  "data bus": "A bidirectional pathway used to transfer the actual data between the CPU, memory, and I/O devices.",
  "system bus": "The main communication channel connecting the CPU, memory, and peripheral controllers.",
  "motherboard": "The main printed circuit board (PCB) that houses and connects all internal computer components.",
  "chipset": "A set of electronic components in an integrated circuit that manages data flow between the processor, memory, and peripherals.",
  "bios": "Basic Input/Output System; firmware used to perform hardware initialization during the booting process.",
  "uefi": "Unified Extensible Firmware Interface; a modern replacement for the traditional BIOS.",
  "post": "Power-On Self-Test; a diagnostic process run by the BIOS to check hardware health at startup.",
  "cold booting": "The process of starting a computer after it has been powered off completely.",
  "warm booting": "The process of restarting a computer without turning the power off.",
  "expansion slot": "A socket on the motherboard used to insert expansion cards for extra functionality (like GPU or Sound card).",
  "usb": "Universal Serial Bus; a standard interface for connecting peripherals to a computer.",
  "hdmi": "High-Definition Multimedia Interface; a standard for transmitting digital video and audio data.",
  "input device": "Any hardware component that allows you to enter data and instructions into a computer.",
  "output device": "Any hardware component that conveys information from a computer to one or more people.",
  "ssd": "Solid State Drive; a faster, more reliable storage device that uses flash memory instead of spinning disks.",
  "optical disk": "A storage medium that uses lasers to read and write data (e.g., CD, DVD).",
  "pen drive": "A portable USB flash memory device used for data storage and transfer.",
  "raid": "Redundant Array of Independent Disks; a technology used to increase data reliability or performance by using multiple disks.",
  "pipelining": "A technique where multiple instructions are overlapped in execution to improve CPU throughput.",
  "fetch cycle": "The stage of the machine cycle where the CPU retrieves an instruction from memory.",
  "decode cycle": "The stage where the Control Unit interprets the fetched instruction to determine the operation.",
  "execute cycle": "The stage where the CPU carries out the action required by the instruction.",
  "machine cycle": "The complete series of steps (Fetch, Decode, Execute, Store) performed by the CPU for every instruction.",
  "throughput": "The amount of work or number of instructions completed by a processor per unit of time.",
  "latency": "The time delay between a request for data and the actual delivery of that data.",
  "dma": "Direct Memory Access; allows hardware to bypass the CPU and transfer data directly to/from memory.",
  "multiprocessor": "A computer system with two or more central processing units (CPUs) that share main memory and peripherals.",
  "risc": "Reduced Instruction Set Computer; a CPU design that uses a small, highly optimized set of instructions.",
  "cisc": "Complex Instruction Set Computer; a CPU design that uses a large number of complex and multi-step instructions.",
  "kernel": "The core part of an operating system that manages system resources and hardware communication.",
  "multitasking": "The ability of an OS to execute more than one task or program simultaneously.",
  "lan": "Local Area Network; a network covering a small geographical area like a home or office.",
  "wan": "Wide Area Network; a network covering a large geographical area, often spanning cities or countries.",
  "router": "A networking device that forwards data packets between different computer networks.",
  "modem": "A device that converts digital data from a computer into an analog signal for transmission over phone lines (and vice-versa).",
  "parallel processing": "The simultaneous execution of multiple instructions or tasks to speed up computation.",
  "cloud computing": "The delivery of computing services (servers, storage, databases) over the internet.",
  "supercomputer": "A computer with a high level of performance compared to a general-purpose computer, used for massive scientific calculations.",
  "embedded system": "A computer system with a dedicated function within a larger mechanical or electrical system.",
  "binary system": "A base-2 number system used by computers, consisting of only 0s and 1s.",
  "byte": "A unit of data that is eight bits long.",
  "ascii": "American Standard Code for Information Interchange; a character encoding standard for electronic communication.",
  "unicode": "A universal character encoding standard that includes characters from almost all writing systems in the world.",
  "assembly language": "A low-level programming language that uses mnemonics to represent machine-level instructions.",
  "overclocking": "The practice of increasing a component's clock rate beyond its factory-rated speed to improve performance.",
  "firewall": "A network security system that monitors and controls incoming and outgoing network traffic based on security rules.",
  "encryption": "The process of converting information into a secret code to prevent unauthorized access."
};

// Merge into the global knowledge base
if (typeof BCA_BOT_KNOWLEDGE !== 'undefined') {
  Object.assign(BCA_BOT_KNOWLEDGE, ARCHITECTURE_KNOWLEDGE);
}
