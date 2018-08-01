/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package caldeiraodofuzzy;

import static java.lang.Math.sqrt;



public class Caldeira {

    public final static double VQMAX = 1; // VAZAO MAXIMA DE AGUA QUENTE EM M CUBICO
    public final static double VFMAX = 1; // VAZAO MAXIMA DE AGUA FRIO EM M CUBICO
    public final static double XMAX = 10; // ALTURA MAXIMA DO TANQUE
    public final static double RAIO = 1; // RAIO DO TANQUE
    public final static double TF = 10; // TEMPERATURA DA AGUA FRIA NA ENTRADA
    public final static double TQ = 50; // TEMPERATURA DA AGUA QUENTE NA ENTRADA
    public final static double VD = 1; // VAZÃO DESEJADA NA SAIDA DO TANQUE
    public final static double TD = 40; // TEMPERATURA DESEJADA NA SAIDA DO TANQUE
    public final static double GRAVIDADE = 9.8;
    public final static double DELTA_T = 1; //INTERVALO DE TEMPO ENTRE CADA MEDIÇÃO
    public final static double PI = 3.14159265358979323846264338; // NUMERO PI
    
    
    
    
    private double a_tanque; // Altura de agua no tanque
    private double t_tanque; // Temperatura da agua no tanque
    private double a_tanque_anterior; // Altura de agua no tanque
    private double t_tanque_anterior; // Temperatura da agua no tanque
    
    
    
    
    
    //a_zero = altura inicial de agua no tanque
    public Caldeira(double a_zero, double t_zero){
        this.a_tanque = a_zero;
        this.t_tanque = t_zero;
        this.a_tanque_anterior = a_zero;
        this.t_tanque_anterior = t_zero;
    }
    
    public double simular(double vq, double vf, double vs){
        
    }
    
    private double vazao(){
        return (0.002)*sqrt(2*GRAVIDADE*a_tanque_anterior);
    }
    
    private double altura(double vq, double vf, double vs){
        return a_tanque_anterior + ((vq + vf - vs)*DELTA_T)/(PI*RAIO*RAIO);
    }
    
    private double temperatura(){
        return (t_tanque_anterior * a_tanque_anterior * PI*RAIO*RAIO + TQ * VQMAX * DELTA_T + TF * VFMAX * DELTA_T)/(a_tanque_anterior * PI * RAIO * RAIO + VQMAX * DELTA_T + VFMAX * DELTA_T);
    }
    
}
