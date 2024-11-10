const { expect } = require('chai');
const sinon = require('sinon');

function calculateTotal(quantity, price) {
    return quantity * price;
}


describe('calculateTotal function', () => {
   
    it('should calculate total correctly for valid input', () => {
        const quantity = 5;
        const price = 10;
        
        const total = calculateTotal(quantity, price);
    
        expect(total).to.equal(50);
    });

   
    it('should return NaN for invalid input', () => {
       
        const quantity = 'invalid';
        const price = 10;
      
        const total = calculateTotal(quantity, price);
 
        expect(total).to.be.NaN;
    });

    it('should call console.log with correct message', () => {

        const consoleStub = sinon.stub(console, 'log');
        

        console.log('Test message');
        
        sinon.assert.calledOnce(consoleStub);
        sinon.assert.calledWithExactly(consoleStub, 'Test message');
        
        console.log.restore();
    });
});
