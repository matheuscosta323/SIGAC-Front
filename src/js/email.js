
import emailjs from "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/+esm";


emailjs.init("l3fKuDmGH-BaAHv9o");

const SERVICE_ID = "service_8fudgyp";
const TEMPLATE_ALUNO = "template_a84pdbp";
const TEMPLATE_COORDENADOR = "template_5npys3f";


export async function avisarCoordenador(nomeAluno, curso, emailCoordenador) {
    try {
        const response = await emailjs.send(
            SERVICE_ID,
            TEMPLATE_COORDENADOR,
            {
                to_email: emailCoordenador,
                nome_aluno: nomeAluno,
                curso: curso
            }
        );

        console.log("Email enviado ao coordenador:", response);
    } catch (error) {
        console.error("Erro ao enviar email ao coordenador:", error);
    }
}


export async function enviarEmailAprovacao(emailAluno, nomeAluno) {
    try {
        const response = await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ALUNO,
            {
                to_email: emailAluno,
                nome_aluno: nomeAluno,
                status: "APROVADA",
                motivo: "Nenhum"
            }
        );

        console.log("Email de aprovação enviado:", response);
    } catch (error) {
        console.error("Erro ao enviar aprovação:", error);
    }
}

export async function enviarEmailRecusa(emailAluno, nomeAluno, motivoRecusa) {
    try {
        const response = await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ALUNO,
            {
                to_email: emailAluno,
                nome_aluno: nomeAluno,
                status: "RECUSADA",
                motivo: motivoRecusa
            }
        );

        console.log("Email de recusa enviado:", response);
    } catch (error) {
        console.error("Erro ao enviar recusa:", error);
    }
}