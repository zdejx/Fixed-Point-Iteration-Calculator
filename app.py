from flask import Flask, render_template, request
from logics.fixedpointiterations import fixedpointiterations

app = Flask(__name__)

#this is the url name, ignore lang most of the time
@app.route('/')
def index(): #name of the page 
    #looks for the .html file in templates
    return render_template('index.html')

@app.route('/fixed-point-iterations', methods=['POST', 'GET'])
def FixedPointIteration_page():
    result = None
    if request.method == 'POST':
        # Use 'equation' as the key to match the 'name' attribute in your HTML
        given = request.form.get('equation')
        interval_val = request.form.get('x0')
        stop_val = request.form.get('stopping_point')
        round_val = request.form.get('roundoff')
        
        solver = fixedpointiterations()
        
        try:
            # 1. First, check for convergence/syntax using GetGx
            # We convert inputs to numerical types here for the logic functions
            gx_result = solver.GetGx(float(interval_val), given)
            result = gx_result # Initialize with derivation info (g', abs_gx, etc)
            result['given'] = given
            result['x0'] = interval_val
            
            if gx_result['success']:
                # 2. If convergent, proceed to calculate iterations
                approx = solver.GetApprox(gx_result['g_of_x'], float(interval_val), float(stop_val), int(round_val))
                
                # Merge iteration results into the main result dictionary
                # This preserves g_prime_x and abs_gx from the first step
                result.update(approx)
                
            # If GetGx failed (divergent), 'result' already contains the error message

        except Exception as e:
            result = {"success": False, "error": f"Input error: {str(e)}"}
            
    return render_template('fixedpointiterations.html', result=result)

@app.route('/Interval', methods=['POST', 'GET'])
def Interval_page():
    result = None
    if request.method == 'POST':
        given = request.form.get('equation')
        f_a_value = request.form.get('f_a')
        f_b_value = request.form.get('f_b')
        
        solver = fixedpointiterations()
        result = solver.GetAB(given, f_a_value, f_b_value)
    
    return render_template('Intervalcalculator.html', result=result)

if __name__ == '__main__':
    app.run(debug=True)
    