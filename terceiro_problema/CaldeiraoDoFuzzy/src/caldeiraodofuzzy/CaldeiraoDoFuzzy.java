/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package caldeiraodofuzzy;

import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import static java.lang.Thread.sleep;
import net.sourceforge.jFuzzyLogic.FIS;
import net.sourceforge.jFuzzyLogic.plot.JFuzzyChart;
import net.sourceforge.jFuzzyLogic.rule.Variable;

/**
 *
 * @author aluno
 */
public class CaldeiraoDoFuzzy {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) throws InterruptedException, IOException {
         // Load from 'FCL' file
        String fileName = "fcl/tipper-rules-change.fcl";
        FIS fis = FIS.load(fileName,true);

        // Error while loading?
        if( fis == null ) { 
            System.err.println("Can't load file: '" + fileName + "'");
            return;
        }

        // Show 
//        JFuzzyChart.get().chart(fis);

        FileWriter arq = new FileWriter("10 30 1 40-rules-change.csv");
        PrintWriter gravar = new PrintWriter(arq);
        gravar.printf("diff_temp, diff_vazao, out_hot, out_cold\n");
        Caldeira c = new Caldeira(10, 30);
        for(int i = 0 ; i <= 1000 ; i ++){
            // Set inputs
            fis.setVariable("diff_temp", c.getDiffTemperatura());
            fis.setVariable("diff_vazao", c.getDiffVazao());
             // Evaluate
            fis.evaluate();
    
            System.out.println("\n\nSimulação: " + i);
            System.out.println("DIFF TEMPERATURA = " + c.getDiffTemperatura());
            System.out.println("DIFF VAZÃO = " + c.getDiffVazao());
            Variable out_hot = fis.getVariable("out_hot");
            Variable out_cold = fis.getVariable("out_cold");
            System.out.println("Vazão atual:" + c.vazao(c.getAltura()));
            
            System.out.println("Out Hot: " + out_hot.getValue());
            System.out.println("Out Cold: " + out_cold.getValue());
            System.out.println("Altura atual: " + c.getAltura());
            gravar.printf(c.getDiffTemperatura()+","+c.getDiffVazao()+","+out_hot.getValue()+","+out_cold.getValue()+"\n");
            
            
            c.simular(out_hot.getValue(), out_cold.getValue());
//            sleep(100);
        }
        gravar.close();

        // Show output variable's chart
//        JFuzzyChart.get().chart(out_hot, out_hot.getDefuzzifier(), true);
        
//        JFuzzyChart.get().chart(out_cold, out_cold.getDefuzzifier(), true);


    }
    
}
